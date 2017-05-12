package auth.controllers

import java.time.Clock

import auth.AuthSpecification
import auth.models.services.UserService
import auth.utils.json.APIFormats._
import com.mohiva.play.silhouette.api.exceptions.ProviderException
import com.mohiva.play.silhouette.api.util.Credentials
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import com.mohiva.play.silhouette.test._
import net.codingwell.scalaguice.ScalaModule
import org.specs2.mock.Mockito
import play.api.i18n.Messages
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.test.{ FakeRequest, WithApplication }
import test.{ ApiSpecification, CSRFSpecification }

import scala.concurrent.Future

/**
 * Test case for the [[SignInController]] class.
 */
class SignInControllerSpec extends ApiSpecification with AuthSpecification with CSRFSpecification with Mockito {
  sequential

  "The `signIn` action" should {
    "return HTTP status 403 if the user is authenticated" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withAuthenticator(loginInfo)

        Response(
          FORBIDDEN,
          controller.signIn(request),
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
          "rememberMe" -> "true"
        )).withCSRFToken

        Response(
          BAD_REQUEST,
          controller.signIn(request),
          "auth.signIn.form.invalid",
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
          "rememberMe" -> "true"
        )).withCSRFToken

        Response(
          BAD_REQUEST,
          controller.signIn(request),
          "auth.signIn.form.invalid",
          Messages("invalid.form"),
          Seq(FormError("password", Messages("error.required")))
        )
      }
    }

    "return HTTP status 400 if the `rememberMe` field is invalid" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj(
          "email" -> email,
          "password" -> password,
          "rememberMe" -> "test"
        )).withCSRFToken

        Response(
          BAD_REQUEST,
          controller.signIn(request),
          "auth.signIn.form.invalid",
          Messages("invalid.form"),
          Seq(FormError("rememberMe", Messages("error.boolean")))
        )
      }
    }

    "return HTTP status 400 if the credentials are invalid" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj(
          "email" -> email,
          "password" -> password,
          "rememberMe" -> "true"
        )).withCSRFToken

        credentialsProvider.authenticate(credentials) returns Future.failed(
          new ProviderException("Invalid credentials")
        )

        Response(
          BAD_REQUEST,
          controller.signIn(request),
          "auth.signIn.credentials",
          Messages("auth.invalid.credentials")
        )
      }
    }

    "return HTTP status 400 if the user was not found" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj(
          "email" -> email,
          "password" -> password,
          "rememberMe" -> "true"
        )).withCSRFToken

        credentialsProvider.authenticate(credentials) returns Future.successful(loginInfo)
        userService.retrieve(loginInfo) returns Future.successful(None)

        Response(
          BAD_REQUEST,
          controller.signIn(request),
          "auth.signIn.credentials",
          Messages("auth.invalid.credentials")
        )
      }
    }

    "return HTTP status 423 if the user is inactive" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj(
          "email" -> email,
          "password" -> password,
          "rememberMe" -> "true"
        )).withCSRFToken

        credentialsProvider.authenticate(credentials) returns Future.successful(loginInfo)
        userService.retrieve(loginInfo) returns Future.successful(Some(
          user.copy(registration = user.registration.copy(activated = false))
        ))

        Response(
          LOCKED,
          controller.signIn(request),
          "auth.signIn.account.inactive",
          Messages("auth.account.inactive"),
          Json.obj("email" -> user.email)
        )
      }
    }

    "return HTTP status 200 if the user could be signed in" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withJsonBody(Json.obj(
          "email" -> email,
          "password" -> password,
          "rememberMe" -> "true"
        )).withCSRFToken

        credentialsProvider.authenticate(credentials) returns Future.successful(loginInfo)
        userService.retrieve(loginInfo) returns Future.successful(Some(
          user.copy(registration = user.registration.copy(activated = true))
        ))

        val result = controller.signIn(request)

        Response(
          OK,
          result,
          "auth.signIn.successful",
          Messages("auth.signed.in"),
          user.copy(registration = user.registration.copy(activated = true))
        )
        cookies(result).get("id") must beSome
      }
    }
  }

  /**
   * The context.
   */
  trait Context extends ApiContext[SignInController] with AuthContext {

    /**
     * The user password.
     */
    val password = "password"

    /**
     * The user credentials.
     */
    val credentials = Credentials(email, password)

    /**
     * The user service mock.
     */
    val userService = mock[UserService].smart

    /**
     * The credentials provider mock.
     */
    val credentialsProvider = mock[CredentialsProvider].smart

    /**
     * The fake module used to instantiate the application.
     */
    override def fakeModule: ScalaModule = new ScalaModule {
      def configure(): Unit = {
        bind[UserService].toInstance(userService)
        bind[CredentialsProvider].toInstance(credentialsProvider)
        bind[Clock].toInstance(clock)
      }
    }

    /**
     * The application builder.
     */
    override def applicationBuilder: GuiceApplicationBuilder =
      super.applicationBuilder
        .configure("silhouette.authenticator.authenticatorExpiry" -> "12 hours")
        .configure("silhouette.authenticator.rememberMe.cookieMaxAge" -> "30 days")
        .configure("silhouette.authenticator.rememberMe.authenticatorIdleTimeout" -> "5 days")
        .configure("silhouette.authenticator.rememberMe.authenticatorExpiry" -> "30 days")
  }
}
