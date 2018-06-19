package core.utils.json

import java.time.Instant
import java.util.UUID

import core.models.{ Config, Registration, Settings, User }
import play.api.i18n.Lang
import play.api.libs.json._
import reactivemongo.bson.BSONObjectID

import scala.util.{ Failure, Success, Try }

/**
 * Implicit JSON formats.
 */
trait Formats {

  /**
   * Renames a branch if it exists.
   */
  val RenameBranch: (JsPath, JsPath) => Reads[JsObject] = (oldPath: JsPath, newPath: JsPath) => {
    (__.json.update(newPath.json.copyFrom(oldPath.json.pick)) andThen oldPath.json.prune).orElse(__.json.pick[JsObject])
  }

  /**
   * Renames the field "_id" into the value given as `name` parameter.
   */
  val IDReads: String => Reads[JsObject] = (name: String) => RenameBranch(__ \ '_id, __ \ Symbol(name))

  /**
   * Transforms the field with the given `name` into the "_id" field.
   */
  val IDWrites: String => JsValue => JsObject = (name: String) => (js: JsValue) => {
    js.as[JsObject] - name ++ (js \ name match {
      case JsDefined(v) => Json.obj("_id" -> v)
      case _            => Json.obj()
    })
  }

  /**
   * Converts [[play.api.i18n.Lang]] object to JSON and vice versa.
   */
  implicit object LangFormat extends Format[Lang] {
    def reads(json: JsValue): JsResult[Lang] = JsSuccess(Lang(json.as[String]))
    def writes(o: Lang): JsValue = JsString(o.code)
  }

  /**
   * Converts [[java.util.UUID]] object to JSON and vice versa.
   */
  implicit object UUIDFormat extends Format[UUID] {
    def reads(json: JsValue): JsResult[UUID] = Try(UUID.fromString(json.as[String])) match {
      case Success(id) => JsSuccess(id)
      case Failure(e)  => JsError(e.getMessage)
    }
    def writes(o: UUID): JsValue = JsString(o.toString)
  }

  /**
   * Converts a [[Settings]] instance to JSON and vice versa.
   */
  implicit val settingsFormat: OFormat[Settings] = Json.format

  /**
   * Converts a [[Config]] instance to JSON and vice versa.
   */
  implicit val configFormat: OFormat[Config] = Json.format
}

/**
 * Implicit JSON formats.
 */
object Formats extends Formats

/**
 * Mongo centric JSON formats.
 */
trait MongoFormats extends Formats {

  /**
   * Converts [[java.time.Instant]] object to JSON and vice versa.
   */
  implicit object InstantFormat extends Format[Instant] {
    def reads(json: JsValue): JsResult[Instant] =
      (__ \ "$date").read[Long].map(Instant.ofEpochMilli).reads(json)
    def writes(o: Instant): JsValue = Json.obj(
      "$date" -> o.toEpochMilli
    )
  }
}

/**
 * API centric JSON formats.
 */
trait APIFormats extends Formats {

  /**
   * Converts [[reactivemongo.bson.BSONObjectID]] object to JSON and vice versa.
   */
  implicit object BSONObjectIDFormat extends Format[BSONObjectID] {
    def reads(json: JsValue): JsResult[BSONObjectID] = BSONObjectID.parse(json.as[String]) match {
      case Success(id) => JsSuccess(id)
      case Failure(e)  => JsError(e.getMessage)
    }
    def writes(o: BSONObjectID): JsValue = JsString(o.stringify)
  }
}

/**
 * Mongo centric JSON formats.
 */
object MongoFormats extends MongoFormats with Formats {
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
}

/**
 * API centric JSON formats.
 */
object APIFormats extends APIFormats with Formats {

  /**
   * Converts a [[Registration]] instance to JSON and vice versa.
   */
  implicit val registrationFormat: OFormat[Registration] = Json.format

  /**
   * Converts a [[User]] instance to JSON and vice versa.
   */
  implicit val userFormat: OFormat[User] = Json.format
}
