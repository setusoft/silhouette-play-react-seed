package auth.controllers

import java.time.Clock
import javax.inject.Inject

import auth.forms.SignUpForm
import auth.models.services.{ AuthTokenService, UserService }
import auth.models.{ Registration, Settings, User }
import auth.utils.DefaultEnv
import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.services.AvatarService
import com.mohiva.play.silhouette.api.util.PasswordHasherRegistry
import com.mohiva.play.silhouette.impl.providers._
import core.controllers.ApiController
import core.utils.JSRouter
import net.ceedubs.ficus.Ficus._
import play.api.Configuration
import play.api.http.HeaderNames
import play.api.i18n.Messages
import play.api.libs.mailer.{ Email, MailerClient }
import play.api.mvc._
import reactivemongo.bson.BSONObjectID

import scala.concurrent.duration._
import scala.concurrent.{ ExecutionContext, Future }
import scala.language.postfixOps

/**
 * The `Sign Up` controller.
 *
 * @param controllerComponents   The Play controller components.
 * @param silhouette             The Silhouette stack.
 * @param userService            The user service implementation.
 * @param authInfoRepository     The auth info repository implementation.
 * @param authTokenService       The auth token service implementation.
 * @param avatarService          The avatar service implementation.
 * @param passwordHasherRegistry The password hasher registry.
 * @param mailerClient           The mailer client.
 * @param configuration          The Play configuration.
 * @param clock                  The clock instance.
 * @param jsRouter               The JS router helper.
 * @param ex                     The execution context.
 */
class SignUpController @Inject() (
  val controllerComponents: ControllerComponents,
  silhouette: Silhouette[DefaultEnv],
  userService: UserService,
  authInfoRepository: AuthInfoRepository,
  authTokenService: AuthTokenService,
  avatarService: AvatarService,
  passwordHasherRegistry: PasswordHasherRegistry,
  mailerClient: MailerClient,
  configuration: Configuration,
  clock: Clock,
  jsRouter: JSRouter
)(
  implicit
  ex: ExecutionContext
) extends ApiController {

  /**
   * Sign up a user.
   *
   * @return A Play result.
   */
  def signUp: Action[AnyContent] = silhouette.UnsecuredAction.async { implicit request =>
    SignUpForm.form.bindFromRequest.fold(
      form => Future.successful(BadRequest(
        ApiResponse("auth.signUp.form.invalid", Messages("invalid.form"), form.errors)
      )),
      data => {
        val loginInfo = LoginInfo(CredentialsProvider.ID, data.email)
        userService.retrieve(loginInfo).flatMap {
          case Some(user) => signUpExistingUser(data, user)
          case None       => signUpNewUser(data, loginInfo)
        }.map { _ =>
          Created(ApiResponse("auth.signUp.successful", Messages("auth.sign.up.email.sent", data.email)))
        }
      }
    )
  }

  /**
   * Sign up an existing user.
   *
   * @param data    The form data.
   * @param user    The user data.
   * @param request The request header.
   * @return A future to wait for the computation to complete.
   */
  private def signUpExistingUser(data: SignUpForm.Data, user: User)(
    implicit
    request: RequestHeader
  ): Future[Unit] = Future {
    val url = jsRouter.absoluteURL("/auth/sign-in")
    mailerClient.send(Email(
      subject = Messages("auth.email.already.signed.up.subject"),
      from = Messages("email.from"),
      to = Seq(data.email),
      bodyText = Some(auth.views.txt.emails.alreadySignedUp(user, url).body),
      bodyHtml = Some(auth.views.html.emails.alreadySignedUp(user, url).body)
    ))
  }

  /**
   * Sign up a new user.
   *
   * @param data      The form data.
   * @param loginInfo The login info.
   * @param request   The request header.
   * @return A future to wait for the computation to complete.
   */
  private def signUpNewUser(data: SignUpForm.Data, loginInfo: LoginInfo)(
    implicit
    request: RequestHeader
  ): Future[Unit] = {
    val c = configuration.underlying
    val tokenExpiry = c.getAs[FiniteDuration](s"auth.authToken.expiry").getOrElse(5 minutes)
    val authInfo = passwordHasherRegistry.current.hash(data.password)
    val user = User(
      id = BSONObjectID.generate,
      loginInfo = Seq(loginInfo),
      name = Some(data.name),
      email = Some(data.email),
      avatarURL = None,
      registration = Registration(
        lang = request.lang,
        ip = request.remoteAddress,
        host = request.headers.get(HeaderNames.HOST),
        userAgent = request.headers.get(HeaderNames.USER_AGENT),
        activated = false,
        dateTime = clock.instant()
      ),
      settings = Settings(
        lang = request.lang,
        timeZone = None
      )
    )
    for {
      avatar <- avatarService.retrieveURL(data.email)
      user <- userService.save(user.copy(avatarURL = avatar))
      _ <- authInfoRepository.add(loginInfo, authInfo)
      authToken <- authTokenService.create(user.id, tokenExpiry)
    } yield {
      val url = jsRouter.absoluteURL("/auth/account/activation/" + authToken.id)
      mailerClient.send(Email(
        subject = Messages("auth.email.sign.up.subject"),
        from = Messages("email.from"),
        to = Seq(data.email),
        bodyText = Some(auth.views.txt.emails.signUp(user, url).body),
        bodyHtml = Some(auth.views.html.emails.signUp(user, url).body)
      ))

      silhouette.env.eventBus.publish(SignUpEvent(user, request))
    }
  }
}
