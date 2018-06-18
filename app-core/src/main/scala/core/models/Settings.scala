package core.models

import play.api.i18n.Lang

/**
 * The user settings.
 *
 * @param lang The users preferred lang.
 * @param timeZone The users preferred time zone.
 */
case class Settings(
  lang: Lang,
  timeZone: Option[String] = None
)
