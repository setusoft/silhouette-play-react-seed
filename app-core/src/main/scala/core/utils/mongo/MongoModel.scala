package core.utils.mongo

import core.exceptions.MongoException
import play.api.libs.json.{ JsObject, Reads }
import play.modules.reactivemongo.json._
import reactivemongo.api.collections.GenericQueryBuilder
import reactivemongo.api.commands.WriteResult
import reactivemongo.api.{ Cursor, ReadPreference }
import reactivemongo.play.json.JSONSerializationPack
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ ExecutionContext, Future }

/**
 * Base model for all models which persists data in a MongoDB.
 */
trait MongoModel {
  type JSONQueryBuilder = GenericQueryBuilder[JSONSerializationPack.type]

  /**
   * The execution context.
   */
  implicit val ec: ExecutionContext

  /**
   * The MongoDB collection.
   */
  protected def collection: Future[JSONCollection]

  /**
   * Helper method to query documents.
   *
   * @param query         The query to execute.
   * @param queryModifier An optional query modifier function.
   * @param maxDocs       The max number of docs to query.
   * @param reader        The JSON reads.
   * @tparam T            The type of the document to read.
   * @return The list of found documents.
   */
  protected def find[T](
    query: JsObject,
    queryModifier: Option[JSONQueryBuilder => JSONQueryBuilder] = None,
    maxDocs: Int = Int.MaxValue
  )(
    implicit
    reader: Reads[T]
  ): Future[List[T]] = collection.flatMap { coll =>
    queryModifier.map(f => f(coll.find(query))).getOrElse(coll.find(query))
      .cursor[T](ReadPreference.nearest).collect[List](maxDocs, Cursor.FailOnError[List[T]]())
  }

  /**
   * Returns some result on success and None on error.
   *
   * @param result The last result.
   * @param entity The entity to return.
   * @tparam T The type of the entity.
   * @return The entity on success or an exception on error.
   */
  protected def onSuccess[T](result: Future[WriteResult], entity: T): Future[T] = result.recoverWith {
    case e => Future.failed(new MongoException("Got exception from MongoDB", Some(e.getCause)))
  }.map { r =>
    WriteResult.lastError(r) match {
      case Some(e) => throw new MongoException(e.message, Some(e))
      case _       => entity
    }
  }

  /**
   * Returns the number of updated documents on success and None on error.
   *
   * @param result The last result.
   * @return The number of updated documents on success or an exception on error.
   */
  protected def updated(result: Future[WriteResult]): Future[Int] = result.recoverWith {
    case e => Future.failed(new MongoException("Got exception from MongoDB", Some(e.getCause)))
  }.map { r =>
    WriteResult.lastError(r) match {
      case Some(e) => throw new MongoException(e.message, Some(e))
      case _       => r.n
    }
  }
}
