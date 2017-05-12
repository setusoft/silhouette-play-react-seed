package auth.models.daos

import java.time.Instant

import auth.models.{ Registration, Settings, User }
import com.mohiva.play.silhouette.api.LoginInfo
import play.api.i18n.Lang
import play.api.test.{ PlaySpecification, WithApplication }
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.bson.BSONObjectID
import test.MongoSpecification

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Test case for the [[UserDAOImpl]] class.
 */
class UserDAOImplSpec extends PlaySpecification with MongoSpecification {

  "The `find` method" should {
    "find a user for the given login info" in new WithMongo with Context {
      val result = await(dao.find(loginInfo))

      result must beSome(user)
    }

    "find a user for the given ID" in new WithMongo with Context {
      val result = await(dao.find(userID))

      result must beSome(user)
    }

    "return None if no user for the given login info exists" in new WithMongo with Context {
      val result = await(dao.find(LoginInfo("test", "test")))

      result should beNone
    }

    "return None if no user for the given ID exists" in new WithMongo with Context {
      val result = await(dao.find(BSONObjectID.generate()))

      result should beNone
    }
  }

  "The `save` method" should {
    "insert a user" in new WithMongo with Context {
      val newUser = user.copy(id = BSONObjectID.generate())

      await(dao.save(newUser)) must be equalTo newUser
      await(dao.find(newUser.id)) must beSome(newUser)
    }

    "update an existing user" in new WithMongo with Context {
      val updatedUser = user.copy(name = Some("Jane Doe"))

      await(dao.save(updatedUser)) must be equalTo updatedUser
      await(dao.find(user.id)) must beSome(updatedUser)
    }
  }

  /**
   * The context.
   */
  trait Context extends MongoScope {
    self: WithApplication =>

    /**
     * The test fixtures to insert.
     */
    override val fixtures = Map(
      "users" -> Seq("models/daos/users/user.json")
    )

    /**
     * The user DAO implementation.
     */
    val dao = new UserDAOImpl(app.injector.instanceOf[ReactiveMongoApi])

    /**
     * A userID for the stored user.
     */
    val userID = BSONObjectID.parse("590998e65e00005e0095f1ce").get

    /**
     * A login info for the stored user.
     */
    val loginInfo = LoginInfo("credentials", "john@doe.com")

    /**
     * The stored user.
     */
    val user = User(
      id = userID,
      loginInfo = Seq(loginInfo),
      name = Some("John Doe"),
      email = Some("john@doe.com"),
      avatarURL = None,
      registration = Registration(
        lang = Lang("en-US"),
        ip = "127.0.0.1",
        host = Some("localhost:9000"),
        userAgent = Some("Chrome/58.0.3029.81 Safari/537.36"),
        activated = true,
        dateTime = Instant.ofEpochMilli(1493826799375L)
      ),
      settings = Settings(
        lang = Lang("en-US")
      )
    )
  }
}
