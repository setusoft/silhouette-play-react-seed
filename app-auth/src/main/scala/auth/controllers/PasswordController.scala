package auth.controllers

import java.util.UUID
import javax.inject.Inject

import auth.models.AuthToken
import auth.models.services.{ AuthTokenService, UserService }
import auth.utils.DefaultEnv
import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.util.{ PasswordHasherRegistry, PasswordInfo }
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import core.controllers.ApiController
import core.utils.JSRouter
import net.ceedubs.ficus.Ficus._
import play.api.Configuration
import play.api.data.Forms._
import play.api.data._
import play.api.i18n.{ Messages, MessagesProvider }
import play.api.libs.mailer.{ Email, MailerClient }
import play.api.mvc.{ Action, AnyContent, ControllerComponents, Result }

import scala.concurrent.duration._
import scala.concurrent.{ ExecutionContext, Future }

/**
 * The `Password` controller.
 *
 * @param controllerComponents   The Play controller components.
 * @param silhouette             The Silhouette stack.
 * @param userService            The user service implementation.
 * @param authInfoRepository     The auth info repository.
 * @param authTokenService       The auth token service implementation.
 * @param passwordHasherRegistry The password hasher registry.
 * @param mailerClient           The mailer client.
 * @param configuration          The Play configuration.
 * @param jsRouter               The JS router helper.
 * @param ex                     The execution context.
 */
class PasswordController @Inject() (
  val controllerComponents: ControllerComponents,
  silhouette: Silhouette[DefaultEnv],
  userService: UserService,
  authInfoRepository: AuthInfoRepository,
  authTokenService: AuthTokenService,
  passwordHasherRegistry: PasswordHasherRegistry,
  mailerClient: MailerClient,
  configuration: Configuration,
  jsRouter: JSRouter
)(
  implicit
  ex: ExecutionContext
) extends ApiController {

  /**
   * Requests an email with password recovery instructions.
   *
   * It sends an email to the given address if it exists in the database. Otherwise we do not show the user
   * a notice for not existing email addresses to prevent the leak of existing email addresses.
   *
   * @return A Play result.
   */
  def recover: Action[AnyContent] = silhouette.UnsecuredAction.async { implicit request =>
    Form("email" -> email).bindFromRequest.fold(
      form => Future.successful(BadRequest(
        ApiResponse("auth.password.recover.form.invalid", Messages("invalid.form"), form.errors)
      )),
      email => {
        val loginInfo = LoginInfo(CredentialsProvider.ID, email)
        val result = Ok(ApiResponse("auth.password.recover.successful", Messages("auth.reset.email.sent")))
        userService.retrieve(loginInfo).flatMap {
          case Some(user) =>
            val c = configuration.underlying
            val tokenExpiry = c.getAs[FiniteDuration](s"auth.authToken.expiry").getOrElse(5 minutes)
            authTokenService.create(user.id, tokenExpiry).map { authToken =>
              val url = jsRouter.absoluteURL("/auth/password/recovery/" + authToken.id)
              mailerClient.send(Email(
                subject = Messages("auth.email.reset.password.subject"),
                from = Messages("email.from"),
                to = Seq(email),
                bodyText = Some(auth.views.txt.emails.resetPassword(user, url).body),
                bodyHtml = Some(auth.views.html.emails.resetPassword(user, url).body)
              ))
              result
            }
          case None => Future.successful(result)
        }
      }
    )
  }

  /**
   * Resets the password.
   *
   * @param token The token to identify a user.
   * @return A Play result.
   */
  def reset(token: UUID): Action[AnyContent] = silhouette.UnsecuredAction.async { implicit request =>
    validateToken(token, authToken =>
      Form("password" -> nonEmptyText).bindFromRequest.fold(
        form => Future.successful(BadRequest(
          ApiResponse("auth.password.reset.form.invalid", Messages("invalid.form"), form.errors)
        )),
        password => userService.retrieve(authToken.userID).flatMap {
          case Some(user) if user.loginInfo.exists(_.providerID == CredentialsProvider.ID) =>
            val passwordInfo = passwordHasherRegistry.current.hash(password)
            val loginInfo = user.loginInfo.find(_.providerID == CredentialsProvider.ID).get
            authInfoRepository.update[PasswordInfo](loginInfo, passwordInfo).map { _ =>
              Ok(ApiResponse("auth.password.reset.successful", Messages("auth.password.reset")))
            }
          case _ => Future.successful(
            BadRequest(ApiResponse("auth.password.reset.token.invalid", Messages("auth.invalid.reset.link")))
          )
        }
      )
    )
  }

  /**
   * An action that validates if a token is valid.
   *
   * @param token The token to validate.
   * @return A Play result.
   */
  def validate(token: UUID): Action[AnyContent] = silhouette.UnsecuredAction.async { implicit request =>
    validateToken(token, _ => {
      Future.successful(Ok(ApiResponse("auth.password.reset.valid", Messages("auth.valid.reset.link"))))
    })
  }

  /**
   * A helper function which validates the reset token and either returns a HTTP 400 result in case of
   * invalidity or a block that returns another result in case of validity.
   *
   * @param token            The token to validate.
   * @param f                The block to execute if the token is valid.
   * @param messagesProvider The Play messages provider.
   * @return A Play result.
   */
  private def validateToken(token: UUID, f: AuthToken => Future[Result])(
    implicit
    messagesProvider: MessagesProvider
  ): Future[Result] = {
    authTokenService.validate(token).flatMap {
      case Some(authToken) => f(authToken)
      case None =>
        Future.successful(
          BadRequest(ApiResponse("auth.password.reset.invalid", Messages("auth.invalid.reset.link")))
        )
    }
  }
}
