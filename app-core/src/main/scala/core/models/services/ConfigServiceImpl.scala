package core.models.services

import core.models.Config
import javax.inject.Inject
import play.api.Configuration

import scala.concurrent.{ ExecutionContext, Future }

/**
 * Default implementation of the [[ConfigService]] trait.
 *
 * @param configuration   The Play configuration.
 * @param ec              The execution context.
 */
class ConfigServiceImpl @Inject() (
  val configuration: Configuration
)(
  implicit
  ec: ExecutionContext
) extends ConfigService {

  /**
   * Gets configuration parameters.
   *
   * @return Configuration parameters.
   */
  override def retrieve(): Future[Config] = {
    // Get config data (from DB, from Play config, ...) that should be available in the frontend part
    Future.successful(Config("replace this"))
  }
}
