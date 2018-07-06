package utils

import javax.inject.Inject

import play.api.http.HttpFilters
import play.api.mvc.EssentialFilter
import play.filters.cors.CORSFilter
import play.filters.csrf.CSRFFilter
import play.filters.headers.SecurityHeadersFilter

/**
 * Provides filters.
 */
class Filters @Inject() (
  corsSFilter: CORSFilter,
  csrfFilter: CSRFFilter,
  securityHeadersFilter: SecurityHeadersFilter
) extends HttpFilters {

  /**
   * Returns the list of filters.
   *
   * @return The list of filters.
   */
  override def filters: Seq[EssentialFilter] = Seq(
    corsSFilter,
    csrfFilter,
    securityHeadersFilter
  )
}
