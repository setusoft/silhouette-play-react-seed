package auth.utils

import javax.inject.Inject

import com.mohiva.play.silhouette.api.actions.SecuredErrorHandler
import core.controllers.ApiController
import play.api.i18n.{ Messages, MessagesApi }
import play.api.mvc.{ RequestHeader, Result }

import scala.concurrent.Future

/**
 * Custom secured error handler.
 *
 * @param messagesApi The Play messages API.
 */
class CustomSecuredErrorHandler @Inject() (
  val messagesApi: MessagesApi
) extends SecuredErrorHandler
  with ApiController {

  /**
   * Called when a user is not authenticated.
   *
   * As defined by RFC 2616, the status code of the response should be 401 Unauthorized.
   *
   * @param request The request header.
   * @return The result to send to the client.
   */
  override def onNotAuthenticated(implicit request: RequestHeader): Future[Result] = {
    Future.successful(Unauthorized(ApiResponse("auth.unauthorized", Messages("auth.unauthorized"))))
  }

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
