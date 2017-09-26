package auth.utils

import javax.inject.Inject

import com.mohiva.play.silhouette.api.actions.UnsecuredErrorHandler
import core.controllers.ApiController
import play.api.i18n.Messages
import play.api.mvc.{ ControllerComponents, RequestHeader, Result }

import scala.concurrent.Future

/**
 * Custom unsecured error handler.
 *
 * @param controllerComponents The Play controller components.
 */
class CustomUnsecuredErrorHandler @Inject() (
  val controllerComponents: ControllerComponents
) extends UnsecuredErrorHandler
  with ApiController {

  /**
   * Called when a user is authenticated but not authorized.
   *
   * As defined by RFC 2616, the status code of the response should be 403 Forbidden.
   *
   * @param request The request header.
   * @return The result to send to the client.
   */
  override def onNotAuthorized(implicit request: RequestHeader): Future[Result] = {
    Future.successful(Forbidden(ApiResponse("auth.forbidden", Messages("auth.forbidden"))))
  }
}
