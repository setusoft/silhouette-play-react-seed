package core.models

import java.time.Instant

import play.api.i18n.Lang

/**
 * The registration data.
 *
 * @param lang      The registration lang.
 * @param ip        The IP from which the user comes.
 * @param host      The host from which the user comes.
 * @param userAgent The user agent of the users client.
 * @param activated Indicates that the user has activated its registration.
 * @param dateTime  The registration date.
 */
case class Registration(
  lang: Lang,
  ip: String,
  host: Option[String],
  userAgent: Option[String],
  activated: Boolean,
  dateTime: Instant
)
