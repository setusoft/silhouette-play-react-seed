package core.utils.route

import play.api.mvc.PathBindable
import reactivemongo.bson.BSONObjectID

import scala.util.{ Failure, Success }

/**
 * Some route binders.
 */
object Binders {

  /**
   * Binder for a [[reactivemongo.bson.BSONObjectID]].
   */
  implicit def objectIdPathBinder: PathBindable[BSONObjectID] = new PathBindable[BSONObjectID] {
    def bind(key: String, value: String): Either[String, BSONObjectID] = {
      BSONObjectID.parse(value) match {
        case Success(id) => Right(id)
        case Failure(_)  => Left("Cannot parse parameter " + key + " as BSONObjectID")
      }
    }
    def unbind(key: String, value: BSONObjectID): String = value.toString
  }
}
