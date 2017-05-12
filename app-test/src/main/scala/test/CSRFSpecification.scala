package test

import org.specs2.mutable.Specification
import play.api.Application
import play.api.test.FakeRequest
import play.filters.csrf.CSRF.Token
import play.filters.csrf.{ CSRFConfigProvider, CSRFFilter }

/**
 * A specification which contains some CSRF specific configuration.
 */
trait CSRFSpecification {
  self: Specification =>

  /**
   * Monkey patches the [[FakeRequest]] class.
   *
   * @param request The request to patch.
   * @tparam B The type of the request body.
   */
  implicit class RichFakeRequest[B](request: FakeRequest[B]) {
    def withCSRFToken(implicit app: Application): FakeRequest[B] = {
      val csrfConfig = app.injector.instanceOf[CSRFConfigProvider].get
      val csrfFilter = app.injector.instanceOf[CSRFFilter]
      val token = csrfFilter.tokenProvider.generateToken

      request.copyFakeRequest(tags = request.tags ++ Map(
        Token.NameRequestTag -> csrfConfig.tokenName,
        Token.RequestTag -> token
      )).withHeaders((csrfConfig.headerName, token))
    }
  }
}
