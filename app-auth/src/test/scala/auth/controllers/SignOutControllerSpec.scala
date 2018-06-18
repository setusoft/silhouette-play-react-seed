package auth.controllers

import com.mohiva.play.silhouette.test._
import core.AuthSpecification
import play.api.i18n.Messages
import play.api.test.{ FakeRequest, WithApplication }
import test.ApiSpecification

/**
 * Test case for the [[SignOutController]] class.
 */
class SignOutControllerSpec extends ApiSpecification with AuthSpecification {
  sequential

  "The `signOut` action" should {
    "return HTTP status 401 if the user isn't authenticated" in new Context {
      new WithApplication(application) {
        val request = FakeRequest()

        Response(
          UNAUTHORIZED,
          controller.signOut(request),
          "auth.unauthorized",
          Messages("auth.unauthorized")
        )
      }
    }

    "return HTTP status 200 if the user was successful signed out" in new Context {
      new WithApplication(application) {
        val request = FakeRequest().withAuthenticator(loginInfo)

        Response(
          OK,
          controller.signOut(request),
          "auth.signOut.successful",
          Messages("auth.signed.out")
        )
      }
    }
  }

  /**
   * The context.
   */
  trait Context extends ApiContext[SignOutController] with AuthContext
}
