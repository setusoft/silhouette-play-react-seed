package controllers

import javax.inject.Inject

import play.api.mvc.{ Action, AnyContent, Controller }
import play.api.{ Configuration, Environment, Mode }

import scala.concurrent.Future

/**
 * The main application controller.
 *
 * @param env  The Play environment.
 * @param conf The Play configuration.
 */
class ApplicationController @Inject() (
  env: Environment,
  conf: Configuration
) extends Controller {

  /**
   * Renders the UI component with the index route.
   *
   * @return The ui component.
   */
  def index: Action[AnyContent] = serveUI("/")

  /**
   * Renders the UI component with the given route.
   *
   * @param route The UI route.
   * @return The ui component.
   */
  def route(route: String): Action[AnyContent] = serveUI(route)

  /**
   * Serves the UI.
   *
   * In development mode it serves the ui app through the started node.js server. In production Play serves
   * the files through the asset pipeline.
   *
   * @param route The UI route.
   * @return The ui component.
   */
  private def serveUI(route: String): Action[AnyContent] = Action.async { request =>
    env.mode match {
      case Mode.Prod => Assets.versioned("/public", "ui/index.html")(request)
      case _ =>
        Future.successful(Redirect(conf.getString("ui.dev.url").getOrElse(
          throw new RuntimeException("Cannot get `ui.dev.url` from config")
        )))
    }
  }
}
