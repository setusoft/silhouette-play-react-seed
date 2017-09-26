package auth.controllers

import java.util.UUID
import javax.inject.Inject

import auth.models.services.{ AuthTokenService, UserService }
import auth.utils.DefaultEnv
import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import core.controllers.ApiController
import core.utils.JSRouter
import net.ceedubs.ficus.Ficus._
import play.api.Configuration
import play.api.data.Forms._
import play.api.data._
import play.api.i18n.Messages
import play.api.libs.mailer.{ Email, MailerClient }
import play.api.mvc.{ Action, AnyContent, ControllerComponents }

import scala.concurrent.duration._
import scala.concurrent.{ ExecutionContext, Future }

/**
 * The `Account` controller.
 *
 * @param controllerComponents  The Play controller components.
 * @param silhouette            The Silhouette stack.
 * @param userService           The user service implementation.
 * @param authTokenService      The auth token service implementation.
 * @param mailerClient          The mailer client.
 * @param configuration         The Play configuration.
 * @param jsRouter              The JS router helper.
 * @param ex                    The execution context.
 */
class AccountController @Inject() (
  val controllerComponents: ControllerComponents,
  silhouette: Silhouette[DefaultEnv],
  userService: UserService,
  authTokenService: AuthTokenService,
  mailerClient: MailerClient,
  configuration: Configuration,
  jsRouter: JSRouter
)(
  implicit
  ex: ExecutionContext
) extends ApiController {

  /**
   * Sends an account activation email to the user with the given email.
   *
   * @return A Play result.
   */
  def send: Action[AnyContent] = silhouette.UnsecuredAction.async { implicit request =>
    Form("email" -> email).bindFromRequest.fold(
      _ => Future.successful(BadRequest(
        ApiResponse("auth.account.activate.email.invalid", Messages("auth.activation.email.invalid"))
      )),
      email => {
        val loginInfo = LoginInfo(CredentialsProvider.ID, email)
        val result = Ok(ApiResponse("auth.account.send.successful", Messages("auth.activation.email.sent", email)))
        userService.retrieve(loginInfo).flatMap {
          case Some(user) if !user.registration.activated =>
            val c = configuration.underlying
            val tokenExpiry = c.getAs[FiniteDuration](s"auth.authToken.expiry").getOrElse(5 minutes)
            authTokenService.create(user.id, tokenExpiry).map { authToken =>
              val url = jsRouter.absoluteURL("/auth/account/activation/" + authToken.id)
              mailerClient.send(Email(
                subject = Messages("auth.email.activate.account.subject"),
                from = Messages("email.from"),
                to = Seq(email),
                bodyText = Some(auth.views.txt.emails.activateAccount(user, url).body),
                bodyHtml = Some(auth.views.html.emails.activateAccount(user, url).body)
              ))
              result
            }
          case _ => Future.successful(result)
        }
      }
    )
  }

  /**
   * Activates an account.
   *
   * @param token The token to identify a user.
   * @return A Play result.
   */
  def activate(token: UUID): Action[AnyContent] = silhouette.UnsecuredAction.async { implicit request =>
    authTokenService.validate(token).flatMap {
      case Some(authToken) => userService.retrieve(authToken.userID).flatMap {
        case Some(user) if user.loginInfo.exists(_.providerID == CredentialsProvider.ID) =>
          userService.save(user.copy(registration = user.registration.copy(activated = true))).map { _ =>
            Ok(ApiResponse("auth.account.activate.successful", Messages("auth.account.activated")))
          }
        case _ => Future.successful(
          BadRequest(ApiResponse("auth.account.activate.invalid", Messages("auth.invalid.activation.link")))
        )
      }
      case None => Future.successful(
        BadRequest(ApiResponse("auth.account.activate.invalid", Messages("auth.invalid.activation.link")))
      )
    }
  }
}
