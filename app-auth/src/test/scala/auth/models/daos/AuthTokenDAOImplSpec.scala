package auth.models.daos

import java.time.Instant
import java.util.UUID

import auth.models.AuthToken
import play.api.test.{ PlaySpecification, WithApplication }
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.bson.BSONObjectID
import test.MongoSpecification

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Test case for the [[AuthTokenDAOImpl]] class.
 */
class AuthTokenDAOImplSpec extends PlaySpecification with MongoSpecification {

  "The `find` method" should {
    "find a token for the given ID" in new WithMongo with Context {
      val result = await(dao.find(id))

      result must beSome(token)
    }

    "return None if no auth info for the given login info exists" in new WithMongo with Context {
      val result = await(dao.find(UUID.randomUUID()))

      result should beNone
    }
  }

  "The `findExpired` method" should {
    "find expired tokens" in new WithMongo with Context {
      val result = await(dao.findExpired(token.expiry.plusSeconds(5)))

      result must be equalTo Seq(token)
    }
  }

  "The `save` method" should {
    "insert a new token" in new WithMongo with Context {
      val newToken = token.copy(id = UUID.randomUUID())

      await(dao.save(newToken)) must be equalTo newToken
      await(dao.find(newToken.id)) must beSome(newToken)
    }

    "update an existing token" in new WithMongo with Context {
      val updatedToken = token.copy(expiry = Instant.now())

      await(dao.save(updatedToken)) must be equalTo updatedToken
      await(dao.find(token.id)) must beSome(updatedToken)
    }
  }

  "The `remove` method" should {
    "remove a token" in new WithMongo with Context {
      await(dao.remove(id))
      await(dao.find(id)) must beNone
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
      "auth.tokens" -> Seq("models/daos/auth-tokens/token.json")
    )

    /**
     * The auth token DAO implementation.
     */
    val dao = new AuthTokenDAOImpl(app.injector.instanceOf[ReactiveMongoApi])

    /**
     * An ID for the stored token.
     */
    val id = UUID.fromString("bdd4e520-8803-4f7d-ab67-9b50c12e9919")

    /**
     * The stored auth token.
     */
    val token = AuthToken(
      id = id,
      userID = BSONObjectID.parse("590998e65e00005e0095f1ce").get,
      expiry = Instant.ofEpochMilli(1493826799375L)
    )
  }
}
