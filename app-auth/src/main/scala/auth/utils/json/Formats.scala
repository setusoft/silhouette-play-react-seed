package auth.utils.json

import auth.models.{ AuthToken, Registration, Settings, User }
import com.mohiva.play.silhouette.api.util.PasswordInfo
import play.api.libs.json.{ Json, OFormat, OWrites, Reads }

/**
 * Implicit JSON formats.
 */
trait Formats extends core.utils.json.Formats {

  /**
   * Converts a [[PasswordInfo]] instance to JSON and vice versa.
   */
  implicit val passwordInfoFormat: OFormat[PasswordInfo] = Json.format

  /**
   * Converts a [[Settings]] instance to JSON and vice versa.
   */
  implicit val settingsFormat: OFormat[Settings] = Json.format
}

/**
 * Mongo centric JSON formats.
 */
object MongoFormats extends core.utils.json.MongoFormats with Formats {
  import reactivemongo.play.json.BSONFormats._

  /**
   * Converts a [[Registration]] instance to JSON and vice versa.
   */
  implicit val registrationFormat: OFormat[Registration] = Json.format

  /**
   * Converts JSON into a [[User]] instance.
   */
  implicit val userReads: Reads[User] = IDReads("id") andThen Json.reads

  /**
   * Converts a [[User]] instance to JSON.
   */
  implicit val userWrites: OWrites[User] = Json.writes.transform(IDWrites("id"))

  /**
   * Converts JSON into a [[AuthToken]] instance.
   */
  implicit val authTokenReads: Reads[AuthToken] = IDReads("id") andThen Json.reads

  /**
   * Converts a [[AuthToken]] instance to JSON.
   */
  implicit val authTokenWrites: OWrites[AuthToken] = Json.writes.transform(IDWrites("id"))
}

/**
 * API centric JSON formats.
 */
object APIFormats extends core.utils.json.APIFormats with Formats {

  /**
   * Converts a [[Registration]] instance to JSON and vice versa.
   */
  implicit val registrationFormat: OFormat[Registration] = Json.format

  /**
   * Converts a [[User]] instance to JSON and vice versa.
   */
  implicit val userFormat: OFormat[User] = Json.format
}
