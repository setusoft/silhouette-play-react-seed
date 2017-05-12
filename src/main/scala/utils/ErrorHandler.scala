package utils

import javax.inject._

import play.api._
import play.api.http.DefaultHttpErrorHandler
import play.api.mvc.Results._
import play.api.mvc._
import play.api.routing.Router

import scala.concurrent._

/**
 * Error handler for Play.
 *
 * @param env          The Play environment.
 * @param config       The Play config.
 * @param sourceMapper The Play source mapper.
 * @param router       The Play router.
 */
@Singleton
class ErrorHandler @Inject() (
  env: Environment,
  config: Configuration,
  sourceMapper: OptionalSourceMapper,
  router: Provider[Router]
) extends DefaultHttpErrorHandler(env, config, sourceMapper, router) {

  /**
   * Invoked when a handler or resource is not found.
   *
   * @param request The request that no handler was found to handle.
   * @param message A message.
   */
  override protected def onNotFound(request: RequestHeader, message: String): Future[Result] = {
    if (request.path.endsWith("/")) {
      Future.successful(MovedPermanently(request.path.dropRight(1)))
    } else {
      super.onNotFound(request, message)
    }
  }
}
