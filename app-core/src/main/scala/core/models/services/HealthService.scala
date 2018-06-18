package core.models.services

import scala.concurrent.Future

/**
 * Service to get the health state of the app.
 */
trait HealthService {

  /**
   * Gets the health state of the app.
   *
   * @return True if the app is healthy, false otherwise.
   */
  def get(): Future[Boolean]
}
