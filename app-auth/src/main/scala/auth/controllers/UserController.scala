package auth.controllers

import auth.utils.json.APIFormats._
import com.mohiva.play.silhouette.api.Silhouette
import core.controllers.ApiController
import core.utils.DefaultEnv
import core.utils.json.APIFormats._
import javax.inject.Inject
import play.api.i18n.Messages
import play.api.libs.json.Json
import play.api.mvc.{ Action, AnyContent, ControllerComponents }

/**
 * The `User` controller.
 *
 * @param controllerComponents  The Play controller components.
 * @param silhouette            The Silhouette stack.
 */
class UserController @Inject() (
  val controllerComponents: ControllerComponents,
  silhouette: Silhouette[DefaultEnv]
) extends ApiController {

  /**
   * Gets a user.
   *
   * @return A Play result.
   */
  def get: Action[AnyContent] = silhouette.SecuredAction { implicit request =>
    Ok(ApiResponse(
      "auth.user.successful",
      Messages("request.ok"),
      Json.toJson(request.identity)
    ))
  }
}
