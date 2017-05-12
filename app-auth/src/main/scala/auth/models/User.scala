package auth.models

import com.mohiva.play.silhouette.api.{ Identity, LoginInfo }
import reactivemongo.bson.BSONObjectID

/**
 * The user object.
 *
 * @param id           The unique ID of the user.
 * @param name         Maybe the name of the authenticated user.
 * @param email        Maybe the email of the authenticated provider.
 * @param avatarURL    Maybe the avatar URL of the authenticated provider.
 * @param registration The registration data.
 * @param settings     The user settings.
 */
case class User(
  id: BSONObjectID,
  loginInfo: Seq[LoginInfo],
  name: Option[String],
  email: Option[String],
  avatarURL: Option[String],
  registration: Registration,
  settings: Settings
) extends Identity
