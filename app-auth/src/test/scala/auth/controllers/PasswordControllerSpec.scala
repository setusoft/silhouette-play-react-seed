package auth.controllers

import java.util.UUID

import auth.AuthSpecification
import auth.models.AuthToken
import auth.models.services.{ AuthTokenService, UserService }
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.util.{ PasswordHasher, PasswordHasherRegistry, PasswordInfo }
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
 * Test case for the [[PasswordController]] class.
 */
class PasswordControllerSpec
  extends ApiSpecification
  with AuthSpecification
  with CSRFSpecification
  with Mockito
  with NoLanguageFeatures {

  sequential

  "The `recover` action" should {
    "return HTTP status 403 if the user is authenticated" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withAuthenticator(loginInfo)

        Response(
          FORBIDDEN,
          controller.recover(request),
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
          controller.recover(request),
          "auth.password.recover.form.invalid",
          Messages("invalid.form"),
          Seq(FormError("email", Messages("error.email")))
        )
      }
    }

    "send a password recovery email if a user with the given email was found" in new Context {
      new WithApplication(application) {
        authTokenService.create(user.id, 5 minutes) returns Future.successful(authToken)
        userService.retrieve(loginInfo) returns Future.successful(Some(user))

        val request = FakeRequest().withJsonBody(Json.obj("email" -> email)).withCSRFToken

        Response(
          OK,
          controller.recover(request),
          "auth.password.recover.successful",
          Messages("auth.reset.email.sent", email)
        )
        there was one(mailerClient).send(any[Email])
      }
    }

    "do not send a password recovery email if no user with the given email was found" in new Context {
      new WithApplication(application) {
        userService.retrieve(loginInfo) returns Future.successful(None)

        val request = FakeRequest().withJsonBody(Json.obj("email" -> email)).withCSRFToken

        Response(
          OK,
          controller.recover(request),
          "auth.password.recover.successful",
          Messages("auth.reset.email.sent", email)
        )
        there was no(mailerClient).send(any[Email])
      }
    }
  }

  "The `reset` action" should {
    "return HTTP status 403 if the user is authenticated" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withAuthenticator(loginInfo)

        Response(
          FORBIDDEN,
          controller.reset(tokenID)(request),
          "auth.forbidden",
          Messages("auth.forbidden")
        )
      }
    }

    "return HTTP status 400 if the token is invalid" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj("password" -> "")).withCSRFToken

        authTokenService.validate(tokenID) returns Future.successful(None)

        Response(
          BAD_REQUEST,
          controller.reset(tokenID)(request),
          "auth.password.reset.invalid",
          Messages("auth.invalid.reset.link")
        )
      }
    }

    "return HTTP status 400 if the `password` field is empty" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj("password" -> "")).withCSRFToken

        authTokenService.validate(tokenID) returns Future.successful(Some(authToken))

        Response(
          BAD_REQUEST,
          controller.reset(tokenID)(request),
          "auth.password.reset.form.invalid",
          Messages("invalid.form"),
          Seq(FormError("password", Messages("error.required")))
        )
      }
    }

    "return HTTP status 400 if no user for the given token exists" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj("password" -> "password")).withCSRFToken

        authTokenService.validate(tokenID) returns Future.successful(Some(authToken))
        userService.retrieve(authToken.userID) returns Future.successful(None)

        Response(
          BAD_REQUEST,
          controller.reset(tokenID)(request),
          "auth.password.reset.token.invalid",
          Messages("auth.invalid.reset.link")
        )
      }
    }

    "return HTTP status 400 if a user has not registered with the credentials provider" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj("password" -> "password")).withCSRFToken

        authTokenService.validate(tokenID) returns Future.successful(Some(authToken))
        userService.retrieve(authToken.userID) returns Future.successful(Some(user.copy(loginInfo = Seq())))

        Response(
          BAD_REQUEST,
          controller.reset(tokenID)(request),
          "auth.password.reset.token.invalid",
          Messages("auth.invalid.reset.link")
        )
      }
    }

    "reset the password" in new Context {
      new WithApplication(application) {
        val password = "password"
        val hashedPassword = "hashed-password"
        val request = FakeRequest().withJsonBody(Json.obj("password" -> password)).withCSRFToken
        val passwordInfo = PasswordInfo("test-hasher", hashedPassword)
        val passwordHasher = mock[PasswordHasher].smart

        passwordHasher.hash(password) returns passwordInfo
        passwordHasherRegistry.current returns passwordHasher
        authTokenService.validate(tokenID) returns Future.successful(Some(authToken))
        userService.retrieve(authToken.userID) returns Future.successful(Some(user))
        authInfoRepository.update[PasswordInfo](loginInfo, passwordInfo) returns Future.successful(passwordInfo)

        Response(
          OK,
          controller.reset(tokenID)(request),
          "auth.password.reset.successful",
          Messages("auth.password.reset")
        )
        there was one(authInfoRepository).update(loginInfo, passwordInfo)
      }
    }
  }

  "The `validate` action" should {
    "return HTTP status 403 if the user is authenticated" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withAuthenticator(loginInfo)

        Response(
          FORBIDDEN,
          controller.validate(tokenID)(request),
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
          controller.validate(tokenID)(request),
          "auth.password.reset.invalid",
          Messages("auth.invalid.reset.link")
        )
      }
    }

    "return HTTP status 200 if the token is valid" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withCSRFToken

        authTokenService.validate(tokenID) returns Future.successful(Some(authToken))

        Response(
          OK,
          controller.validate(tokenID)(request),
          "auth.password.reset.valid",
          Messages("auth.valid.reset.link")
        )
      }
    }
  }

  /**
   * The context.
   */
  trait Context extends ApiContext[PasswordController] with AuthContext {

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
     * The auth info repository mock.
     */
    val authInfoRepository = mock[AuthInfoRepository].smart

    /**
     * The auth token service mock.
     */
    val authTokenService = mock[AuthTokenService].smart

    /**
     * The password hasher registry mock.
     */
    val passwordHasherRegistry = mock[PasswordHasherRegistry].smart

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
        bind[AuthInfoRepository].toInstance(authInfoRepository)
        bind[AuthTokenService].toInstance(authTokenService)
        bind[PasswordHasherRegistry].toInstance(passwordHasherRegistry)
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
