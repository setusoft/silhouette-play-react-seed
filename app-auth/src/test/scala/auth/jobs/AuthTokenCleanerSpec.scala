package auth.jobs

import java.time.Clock

import akka.actor._
import akka.testkit.{ ImplicitSender, TestKit }
import auth.jobs.AuthTokenCleaner._
import auth.models.services.AuthTokenService
import net.codingwell.scalaguice.ScalaModule
import org.specs2.mock.Mockito
import play.api.libs.concurrent.AkkaGuiceSupport
import play.api.test.WithApplication
import test.AkkaSpecification

import scala.concurrent.Future

/**
 * Test case for the [[AuthTokenCleaner]] class.
 */
class AuthTokenCleanerSpec extends AkkaSpecification with Mockito {

  "The `receive` method" should {
    "start the cleaning of auth tokens" in new Context {
      new WithApplication(application) {
        new TestKit(actorSystem) with ImplicitSender {
          authTokenService.clean returns Future.successful(Seq())

          actor ! Clean

          expectMsg(Cleaned(Seq()))
          there was one(authTokenService).clean
        }
      }
    }

    "return sends the failed message if an error occurred" in new Context {
      new WithApplication(application) {
        new TestKit(actorSystem) with ImplicitSender {
          val error = new RuntimeException("An error occurred")

          authTokenService.clean returns Future.failed(error)

          actor ! Clean

          expectMsg(Failed(error))
          there was one(authTokenService).clean
        }
      }
    }
  }

  /**
   * The context.
   */
  trait Context extends AkkaContext {

    /**
     * The auth token service.
     */
    val authTokenService = mock[AuthTokenService].smart

    /**
     * The fake Guice module.
     */
    override val fakeModule = new ScalaModule with AkkaGuiceSupport {
      def configure(): Unit = {
        bindActor[AuthTokenCleaner](AuthTokenCleaner.Name)
        bind[AuthTokenService].toInstance(authTokenService)
        bind[Clock].toInstance(clock)
      }
    }

    /**
     * The actor to test.
     */
    val actor = actorRef(AuthTokenCleaner.Name)
  }
}
