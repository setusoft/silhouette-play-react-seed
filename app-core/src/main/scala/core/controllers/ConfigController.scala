package core.controllers

import com.mohiva.play.silhouette.api.Silhouette
import core.models.services.ConfigService
import core.utils.DefaultEnv
import core.utils.json.APIFormats._
import javax.inject.Inject
import play.api.i18n.Messages
import play.api.mvc.{ Action, AnyContent, ControllerComponents }

import scala.concurrent.ExecutionContext

/**
 * The `Config` controller.
 *
 * @param controllerComponents The Play controller components.
 * @param silhouette           The Silhouette stack.
 * @param configService        The config service.
 * @param ex                   The execution context.
 */
class ConfigController @Inject() (
  val controllerComponents: ControllerComponents,
  silhouette: Silhouette[DefaultEnv],
  configService: ConfigService
)(
  implicit
  ex: ExecutionContext
) extends ApiController {

  /**
   * Gets the settings.
   *
   * @return The settings.
   */
  def get: Action[AnyContent] = silhouette.SecuredAction.async { implicit request =>
    configService.retrieve().map { configuration =>
      Ok(ApiResponse("core.config", Messages("request.ok"), configuration))
    }
  }
}
