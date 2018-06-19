package auth.controllers

import java.time.Clock
import java.util.UUID

import auth.models.AuthToken
import auth.models.services.AuthTokenService
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.services.AvatarService
import com.mohiva.play.silhouette.api.util.{ PasswordHasher, PasswordHasherRegistry, PasswordInfo }
import com.mohiva.play.silhouette.test._
import core.AuthSpecification
import core.models.User
import core.models.services.UserService
import net.codingwell.scalaguice.ScalaModule
import org.specs2.control.NoLanguageFeatures
import org.specs2.mock.Mockito
import play.api.http.HeaderNames
import play.api.i18n.Messages
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.mailer.{ Email, MailerClient }
import play.api.test.CSRFTokenHelper._
import play.api.test.{ FakeRequest, WithApplication }
import test.ApiSpecification

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.postfixOps

/**
 * Test case for the [[SignUpController]] class.
 */
class SignUpControllerSpec
  extends ApiSpecification
  with AuthSpecification
  with Mockito
  with NoLanguageFeatures {

  sequential

  "The `signUp` action" should {
    "return HTTP status 403 if the user is authenticated" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withAuthenticator(loginInfo)

        Response(
          FORBIDDEN,
          controller.signUp(request),
          "auth.forbidden",
          Messages("auth.forbidden")
        )
      }
    }

    "return HTTP status 400 if the `email` field is invalid" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj(
          "email" -> "invalid",
          "password" -> password,
          "name" -> name
        )).withCSRFToken

        Response(
          BAD_REQUEST,
          controller.signUp(request),
          "auth.signUp.form.invalid",
          Messages("invalid.form"),
          Seq(FormError("email", Messages("error.email")))
        )
      }
    }

    "return HTTP status 400 if the `password` field is missing" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj(
          "email" -> email,
          "password" -> "",
          "name" -> "John Doe"
        )).withCSRFToken

        Response(
          BAD_REQUEST,
          controller.signUp(request),
          "auth.signUp.form.invalid",
          Messages("invalid.form"),
          Seq(FormError("password", Messages("error.required")))
        )
      }
    }

    "return HTTP status 400 if the `name` field is missing" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj(
          "email" -> email,
          "password" -> password,
          "name" -> ""
        )).withCSRFToken

        Response(
          BAD_REQUEST,
          controller.signUp(request),
          "auth.signUp.form.invalid",
          Messages("invalid.form"),
          Seq(FormError("name", Messages("error.required")))
        )
      }
    }

    "send an email to an already existing user" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj(
          "email" -> email,
          "password" -> password,
          "name" -> name
        )).withCSRFToken

        userService.retrieve(loginInfo) returns Future.successful(Some(user))

        Response(
          CREATED,
          controller.signUp(request),
          "auth.signUp.successful",
          Messages("auth.sign.up.email.sent")
        )
        there was one(mailerClient).send(any[Email])
      }
    }

    "register a new user and send an account activation email" in new Context {
      new WithApplication(application) {
        val captor = capture[User]
        val host = "localhost:9000"
        val userAgent = "Chrome/58.0.3029.81 Safari/537.36"
        val avatarURL = "http://my.avatar/photo.jpg"
        val hashedPassword = "hashed-password"
        val passwordHasher = mock[PasswordHasher].smart
        val passwordInfo = PasswordInfo("test-hasher", hashedPassword)
        val request = FakeRequest()
          .withJsonBody(Json.obj(
            "email" -> email,
            "password" -> password,
            "name" -> "John Doe"
          ))
          .withHeaders(
            HeaderNames.HOST -> host,
            HeaderNames.USER_AGENT -> userAgent,
            HeaderNames.ACCEPT_LANGUAGE -> lang.code
          )
          .withCSRFToken

        passwordHasher.hash(password) returns passwordInfo
        passwordHasherRegistry.current returns passwordHasher
        userService.retrieve(loginInfo) returns Future.successful(None)
        avatarService.retrieveURL(email) returns Future.successful(Some(avatarURL))
        authInfoRepository.add(loginInfo, passwordInfo) returns Future.successful(passwordInfo)
        authTokenService.create(user.id, 5 minutes) returns Future.successful(authToken)
        userService.save(any[User]) returns Future.successful(user)

        Response(
          CREATED,
          controller.signUp(request),
          "auth.signUp.successful",
          Messages("auth.sign.up.email.sent")
        )
        there was one(mailerClient).send(any[Email])
        there was one(userService).save(captor)

        val u = captor.value
        u.loginInfo must be equalTo Seq(loginInfo)
        u.name must beSome(name)
        u.email must beSome(email)
        u.avatarURL must beSome(avatarURL)
        u.registration.lang must be equalTo lang
        u.registration.ip must be equalTo "127.0.0.1"
        u.registration.host must beSome(host)
        u.registration.userAgent must beSome(userAgent)
        u.registration.activated must beFalse
        u.registration.dateTime must be equalTo clock.instant()
        u.settings.lang must be equalTo lang
        u.settings.timeZone must beNone
      }
    }
  }

  /**
   * The context.
   */
  trait Context extends ApiContext[SignUpController] with AuthContext {

    /**
     * The user name.
     */
    val name = "John Doe"

    /**
     * The user password.
     */
    val password = "password"

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
     * The avatar service mock.
     */
    val avatarService = mock[AvatarService].smart

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
        bind[AvatarService].toInstance(avatarService)
        bind[PasswordHasherRegistry].toInstance(passwordHasherRegistry)
        bind[MailerClient].toInstance(mailerClient)
        bind[Clock].toInstance(clock)
      }
    }

    /**
     * The application builder.
     */
    override def applicationBuilder: GuiceApplicationBuilder =
      super.applicationBuilder
        .configure("ui.dev.url" -> "test")
        .configure("play.i18n.langs" -> Seq(lang.code))
  }
}
