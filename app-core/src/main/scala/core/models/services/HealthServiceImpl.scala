package core.models.services

import core.utils.Logger
import javax.inject.Inject

import scala.concurrent.{ ExecutionContext, Future }

/**
 * Default implementation of the [[HealthService]] trait.
 */
class HealthServiceImpl @Inject() ()(
  implicit
  ex: ExecutionContext
) extends HealthService with Logger {

  /**
   * Gets the health state of the app.
   *
   * @return True if the app is healthy, false otherwise.
   */
  def get(): Future[Boolean] = {
    // Return true if all backend services (databases, APIs , ...) are running healthy, otherwise return false
    Future.successful(true)
  }
}
