package auth.controllers

import auth.AuthSpecification
import auth.utils.json.APIFormats._
import com.mohiva.play.silhouette.test._
import play.api.i18n.Messages
import play.api.test.{ FakeRequest, WithApplication }
import test.ApiSpecification

/**
 * Test case for the [[UserController]] class.
 */
class UserControllerSpec extends ApiSpecification with AuthSpecification {
  sequential

  "The `user` action" should {
    "return HTTP status 401 if the user isn't authenticated" in new Context {
      new WithApplication(application) {
        val request = FakeRequest()

        Response(
          UNAUTHORIZED,
          controller.get(request),
          "auth.unauthorized",
          Messages("auth.unauthorized")
        )
      }
    }

    "return HTTP status 200 with the user" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withAuthenticator(loginInfo)

        Response(
          OK,
          controller.get(request),
          "auth.user.successful",
          Messages("request.ok"),
          user
        )
      }
    }
  }

  /**
   * The context.
   */
  trait Context extends ApiContext[UserController] with AuthContext
}
