package auth.controllers

import java.util.UUID

import auth.AuthSpecification
import auth.models.services.{ AuthTokenService, UserService }
import auth.models.{ AuthToken, User }
import com.mohiva.play.silhouette.test._
import net.codingwell.scalaguice.ScalaModule
import org.specs2.control.NoLanguageFeatures
import org.specs2.mock.Mockito
import play.api.i18n.Messages
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.mailer.{ Email, MailerClient }
import play.api.test.{ FakeRequest, WithApplication }
import test.{ ApiSpecification, CSRFSpecification }

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.postfixOps

/**
 * Test case for the [[AccountController]] class.
 */
class AccountControllerSpec
  extends ApiSpecification
  with AuthSpecification
  with CSRFSpecification
  with Mockito
  with NoLanguageFeatures {

  sequential

  "The `send` action" should {
    "return HTTP status 403 if the user is authenticated" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withAuthenticator(loginInfo)

        Response(
          FORBIDDEN,
          controller.send(request),
          "auth.forbidden",
          Messages("auth.forbidden")
        )
      }
    }

    "return HTTP status 400 if the `email` field is invalid" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj("email" -> "invalid")).withCSRFToken

        Response(
          BAD_REQUEST,
          controller.send(request),
          "auth.account.activate.email.invalid",
          Messages("auth.activation.email.invalid")
        )
      }
    }

    "send an email account activation for a non activated user" in new Context {
      new WithApplication(application) {
        authTokenService.create(user.id, 5 minutes) returns Future.successful(authToken)
        userService.retrieve(loginInfo) returns Future.successful(Some(
          user.copy(registration = user.registration.copy(activated = false))
        ))

        val request = FakeRequest().withJsonBody(Json.obj("email" -> email)).withCSRFToken

        Response(
          OK,
          controller.send(request),
          "auth.account.send.successful",
          Messages("auth.activation.email.sent", email)
        )
        there was one(mailerClient).send(any[Email])
      }
    }

    "not send an account activation email for already activated account" in new Context {
      new WithApplication(application) {
        userService.retrieve(loginInfo) returns Future.successful(Some(
          user.copy(registration = user.registration.copy(activated = true))
        ))

        val request = FakeRequest().withJsonBody(Json.obj("email" -> email)).withCSRFToken

        Response(
          OK,
          controller.send(request),
          "auth.account.send.successful",
          Messages("auth.activation.email.sent", email)
        )
        there was no(mailerClient).send(any[Email])
      }
    }

    "not send an account activation email for a not existing account" in new Context {
      new WithApplication(application) {
        userService.retrieve(loginInfo) returns Future.successful(None)

        val request = FakeRequest().withJsonBody(Json.obj("email" -> email)).withCSRFToken

        Response(
          OK,
          controller.send(request),
          "auth.account.send.successful",
          Messages("auth.activation.email.sent", email)
        )
        there was no(mailerClient).send(any[Email])
      }
    }
  }

  "The `activate` action" should {
    "return HTTP status 403 if the user is authenticated" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withAuthenticator(loginInfo)

        Response(
          FORBIDDEN,
          controller.activate(UUID.randomUUID())(request),
          "auth.forbidden",
          Messages("auth.forbidden")
        )
      }
    }

    "return HTTP status 400 if the token is invalid" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withCSRFToken

        authTokenService.validate(tokenID) returns Future.successful(None)

        Response(
          BAD_REQUEST,
          controller.activate(tokenID)(request),
          "auth.account.activate.invalid",
          Messages("auth.invalid.activation.link")
        )
      }
    }

    "return HTTP status 400 if no user for the given token exists" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withCSRFToken

        authTokenService.validate(tokenID) returns Future.successful(Some(authToken))
        userService.retrieve(authToken.userID) returns Future.successful(None)

        Response(
          BAD_REQUEST,
          controller.activate(tokenID)(request),
          "auth.account.activate.invalid",
          Messages("auth.invalid.activation.link")
        )
      }
    }

    "return HTTP status 400 if a user has not registered with the credentials provider" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withCSRFToken

        authTokenService.validate(tokenID) returns Future.successful(Some(authToken))
        userService.retrieve(authToken.userID) returns Future.successful(Some(user.copy(loginInfo = Seq())))

        Response(
          BAD_REQUEST,
          controller.activate(tokenID)(request),
          "auth.account.activate.invalid",
          Messages("auth.invalid.activation.link")
        )
      }
    }

    "activate the user" in new Context {
      new WithApplication(application) {
        val captor = capture[User]
        val request = FakeRequest().withCSRFToken

        authTokenService.validate(tokenID) returns Future.successful(Some(authToken))
        userService.retrieve(authToken.userID) returns Future.successful(Some(user))
        userService.save(any[User]) returns Future.successful(user)

        Response(
          OK,
          controller.activate(tokenID)(request),
          "auth.account.activate.successful",
          Messages("auth.account.activated")
        )
        there was one(userService).save(captor)

        captor.value.registration.activated must beTrue
      }
    }
  }

  /**
   * The context.
   */
  trait Context extends ApiContext[AccountController] with AuthContext {

    /**
     * A auth token ID.
     */
    val tokenID = UUID.randomUUID()

    /**
     * An auth token.
     */
    val authToken = AuthToken(tokenID, user.id, clock.instant())

    /**
     * The user service mock.
     */
    val userService = mock[UserService].smart

    /**
     * The auth token service mock.
     */
    val authTokenService = mock[AuthTokenService].smart

    /**
     * The mailer client mock.
     */
    val mailerClient = mock[MailerClient].smart

    /**
     * The fake module used to instantiate the application.
     */
    override def fakeModule: ScalaModule = new ScalaModule {
      def configure(): Unit = {
        bind[UserService].toInstance(userService)
        bind[AuthTokenService].toInstance(authTokenService)
        bind[MailerClient].toInstance(mailerClient)
      }
    }

    /**
     * The application builder.
     */
    override def applicationBuilder: GuiceApplicationBuilder =
      super.applicationBuilder
        .configure("ui.dev.url" -> "test")
  }
}
