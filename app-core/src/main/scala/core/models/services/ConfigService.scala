package core.models.services

import core.models.Config

import scala.concurrent.Future

/**
 * Handles actions to the config.
 */
trait ConfigService {

  /**
   * Gets configuration parameters.
   *
   * @return Configuration parameters.
   */
  def retrieve(): Future[Config]
}
