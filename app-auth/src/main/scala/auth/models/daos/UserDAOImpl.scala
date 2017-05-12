package auth.models.daos

import javax.inject.Inject

import auth.models.User
import auth.utils.json.MongoFormats._
import com.mohiva.play.silhouette.api.LoginInfo
import core.utils.mongo.MongoModel
import play.api.libs.json.Json
import play.modules.reactivemongo.ReactiveMongoApi
import play.modules.reactivemongo.json._
import reactivemongo.bson.BSONObjectID
import reactivemongo.play.json.BSONFormats.BSONObjectIDFormat
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ ExecutionContext, Future }

/**
 * Give access to the [[User]] object.
 *
 * @param reactiveMongoApi The ReactiveMongo API.
 * @param ec               The execution context.
 */
class UserDAOImpl @Inject() (reactiveMongoApi: ReactiveMongoApi)(
  implicit
  ec: ExecutionContext
) extends UserDAO with MongoModel {

  /**
   * The MongoDB collection.
   */
  protected def collection = reactiveMongoApi.database.map(_.collection[JSONCollection]("users"))

  /**
   * Finds a user by its login info.
   *
   * @param loginInfo The login info of the user to find.
   * @return The found user or None if no user for the given login info could be found.
   */
  def find(loginInfo: LoginInfo): Future[Option[User]] =
    collection.flatMap(_.find(Json.obj("loginInfo" -> loginInfo)).one[User])

  /**
   * Finds a user by its user ID.
   *
   * @param userID The ID of the user to find.
   * @return The found user or None if no user for the given ID could be found.
   */
  def find(userID: BSONObjectID): Future[Option[User]] =
    collection.flatMap(_.find(Json.obj("_id" -> BSONObjectIDFormat.partialWrites(userID))).one[User])

  /**
   * Saves a user.
   *
   * @param user The user to save.
   * @return The saved user.
   */
  def save(user: User): Future[User] = {
    onSuccess(collection.flatMap(
      _.update(
        Json.obj("_id" -> BSONObjectIDFormat.partialWrites(user.id)),
        user,
        upsert = true
      )
    ), user)
  }
}
