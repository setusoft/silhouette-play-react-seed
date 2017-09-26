package auth.models.daos

import java.time.Instant
import java.util.UUID
import javax.inject.Inject

import auth.models.AuthToken
import auth.utils.json.MongoFormats._
import core.utils.mongo.MongoModel
import play.api.libs.json.Json
import play.modules.reactivemongo.ReactiveMongoApi
import play.modules.reactivemongo.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ ExecutionContext, Future }

/**
 * Give access to the [[AuthToken]] object.
 *
 * @param reactiveMongoApi The ReactiveMongo API.
 * @param ec               The execution context.
 */
class AuthTokenDAOImpl @Inject() (reactiveMongoApi: ReactiveMongoApi)(
  implicit
  val ec: ExecutionContext
) extends AuthTokenDAO with MongoModel {

  /**
   * The MongoDB collection.
   */
  protected def collection = reactiveMongoApi.database.map(_.collection[JSONCollection]("auth.tokens"))

  /**
   * Finds a token by its ID.
   *
   * @param id The unique token ID.
   * @return The found token or None if no token for the given ID could be found.
   */
  def find(id: UUID): Future[Option[AuthToken]] = collection.flatMap(_.find(Json.obj("_id" -> id)).one[AuthToken])

  /**
   * Finds expired tokens.
   *
   * @param instant The current instant.
   */
  def findExpired(instant: Instant): Future[Seq[AuthToken]] =
    find[AuthToken](Json.obj("expiry" -> Json.obj("$lte" -> instant)))

  /**
   * Saves a token.
   *
   * If the token doesn't exists then it will be added, otherwise it will be updated.
   *
   * @param token The token to save.
   * @return The saved token.
   */
  def save(token: AuthToken): Future[AuthToken] = onSuccess(collection.flatMap(
    _.update(Json.obj("_id" -> token.id), token, upsert = true)
  ), token)

  /**
   * Removes the token for the given ID.
   *
   * @param id The ID for which the token should be removed.
   * @return A future to wait for the process to be completed.
   */
  def remove(id: UUID): Future[Unit] = onSuccess(collection.flatMap(_.remove(Json.obj("_id" -> id))), ())
}
