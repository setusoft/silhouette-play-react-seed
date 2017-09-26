package auth.controllers

import javax.inject.Inject

import auth.utils.DefaultEnv
import auth.utils.json.APIFormats._
import com.mohiva.play.silhouette.api.Silhouette
import core.controllers.ApiController
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
      Messages("valid.result"),
      Json.toJson(request.identity)
    ))
  }
}
