package auth.utils.json

import auth.models.AuthToken
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
}

/**
 * Mongo centric JSON formats.
 */
object MongoFormats extends core.utils.json.MongoFormats with Formats {
  import reactivemongo.play.json.BSONFormats._

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
object APIFormats extends core.utils.json.APIFormats with Formats
