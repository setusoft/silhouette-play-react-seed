package auth.utils.json

import auth.models.{ AuthToken, Registration, Settings, User }
import com.mohiva.play.silhouette.api.util.PasswordInfo
import play.api.libs.json.Json

/**
 * Implicit JSON formats.
 */
trait Formats extends core.utils.json.Formats {

  /**
   * Converts a [[PasswordInfo]] instance to JSON and vice versa.
   */
  implicit val passwordInfoFormat = Json.format[PasswordInfo]

  /**
   * Converts a [[Settings]] instance to JSON and vice versa.
   */
  implicit val settingsFormat = Json.format[Settings]
}

/**
 * Mongo centric JSON formats.
 */
object MongoFormats extends core.utils.json.MongoFormats with Formats {
  import reactivemongo.play.json.BSONFormats._

  /**
   * Converts a [[Registration]] instance to JSON and vice versa.
   */
  implicit val registrationFormat = Json.format[Registration]

  /**
   * Converts JSON into a [[User]] instance.
   */
  implicit val userReads = IDReads("id") andThen Json.reads[User]

  /**
   * Converts a [[User]] instance to JSON.
   */
  implicit val userWrites = Json.writes[User].transform(IDWrites("id"))

  /**
   * Converts JSON into a [[AuthToken]] instance.
   */
  implicit val authTokenReads = IDReads("id") andThen Json.reads[AuthToken]

  /**
   * Converts a [[AuthToken]] instance to JSON.
   */
  implicit val authTokenWrites = Json.writes[AuthToken].transform(IDWrites("id"))
}

/**
 * API centric JSON formats.
 */
object APIFormats extends core.utils.json.APIFormats with Formats {

  /**
   * Converts a [[Registration]] instance to JSON and vice versa.
   */
  implicit val registrationFormat = Json.format[Registration]

  /**
   * Converts a [[User]] instance to JSON and vice versa.
   */
  implicit val userFormat = Json.format[User]
}
