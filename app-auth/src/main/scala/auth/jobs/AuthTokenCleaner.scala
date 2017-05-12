package auth.jobs

import java.time.Clock
import javax.inject.Inject

import akka.actor._
import auth.jobs.AuthTokenCleaner._
import auth.models.AuthToken
import auth.models.services.AuthTokenService
import core.utils.Logger

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * A job which cleanup invalid auth tokens.
 *
 * @param service The auth token service implementation.
 * @param clock The clock implementation.
 */
class AuthTokenCleaner @Inject() (
  service: AuthTokenService,
  clock: Clock
) extends Actor with Logger {

  /**
   * Process the received messages.
   */
  def receive: Receive = {
    case Clean =>
      val origSender = sender()
      val start = clock.instant().toEpochMilli
      val msg = new StringBuffer("\n")
      msg.append("=================================\n")
      msg.append("Start to cleanup auth tokens\n")
      msg.append("=================================\n")
      service.clean.map { deleted =>
        origSender ! Cleaned(deleted)
        val seconds = (clock.instant().toEpochMilli - start) / 1000
        msg.append("Total of %s auth tokens(s) were deleted in %s seconds".format(deleted.length, seconds)).append("\n")
        msg.append("=================================\n")
        msg.append("=================================\n")
        logger.info(msg.toString)
      }.recover {
        case e =>
          origSender ! Failed(e)
          msg.append("Couldn't cleanup auth tokens because of unexpected error\n")
          msg.append("=================================\n")
          logger.error(msg.toString, e)

      }
  }
}

/**
 * The companion object.
 */
object AuthTokenCleaner {
  case object Clean
  case class Cleaned(tokens: Seq[AuthToken])
  case class Failed(e: Throwable)

  /**
   * The name of the actor.
   */
  final val Name = "auth-token-cleaner"
}
