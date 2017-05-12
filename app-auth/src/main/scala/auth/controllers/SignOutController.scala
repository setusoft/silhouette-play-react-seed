package auth.controllers

import javax.inject.Inject

import auth.utils.DefaultEnv
import com.mohiva.play.silhouette.api.{ LogoutEvent, Silhouette }
import core.controllers.ApiController
import play.api.i18n.{ Messages, MessagesApi }
import play.api.mvc.{ Action, AnyContent }

/**
 * The `Sign In` controller.
 *
 * @param messagesApi The Play messages API.
 * @param silhouette  The Silhouette stack.
 */
class SignOutController @Inject() (
  val messagesApi: MessagesApi,
  silhouette: Silhouette[DefaultEnv]
) extends ApiController {

  /**
   * Sign out a user.
   *
   * @return A Play result.
   */
  def signOut: Action[AnyContent] = silhouette.SecuredAction.async { implicit request =>
    silhouette.env.eventBus.publish(LogoutEvent(request.identity, request))
    silhouette.env.authenticatorService.discard(request.authenticator, Ok(ApiResponse(
      "auth.signOut.successful",
      Messages("auth.signed.out")
    )))
  }
}
