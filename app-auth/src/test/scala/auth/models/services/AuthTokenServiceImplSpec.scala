package auth.models.services

import java.time.{ Clock, Instant, ZoneId }
import java.util.UUID

import auth.models.AuthToken
import auth.models.daos.AuthTokenDAO
import org.specs2.control.NoLanguageFeatures
import org.specs2.mock.Mockito
import org.specs2.specification.Scope
import play.api.test.PlaySpecification
import reactivemongo.bson.BSONObjectID

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.postfixOps

/**
 * Test case for the [[AuthTokenServiceImpl]] class.
 */
class AuthTokenServiceImplSpec extends PlaySpecification with Mockito with NoLanguageFeatures {

  "The `create` method" should {
    "create a new auth token and save it in the DB" in new Context {
      dao.save(any[AuthToken]) answers { p => Future.successful(p.asInstanceOf[AuthToken]) }

      val userID = BSONObjectID.generate()
      val expiry = 1 second

      val token = await(service.create(userID, expiry))

      token.userID must be equalTo userID
      token.expiry must be equalTo clock.instant().plusSeconds(expiry.toSeconds)

      there was one(dao).save(any[AuthToken])
    }
  }

  "The `validate` method" should {
    "return the token if one as found for the given ID" in new Context {
      val id = UUID.randomUUID()
      val token = AuthToken(id, BSONObjectID.generate(), clock.instant())

      dao.find(id) returns Future.successful(Some(token))

      await(service.validate(id)) must beSome(token)
      there was one(dao).find(id)
    }
  }

  "The `clean` method" should {
    "clean all expired tokens" in new Context {
      val token1 = AuthToken(UUID.randomUUID(), BSONObjectID.generate(), clock.instant())
      val token2 = AuthToken(UUID.randomUUID(), BSONObjectID.generate(), clock.instant())
      val tokens = Seq(token1, token2)

      dao.findExpired(clock.instant()) returns Future.successful(tokens)
      dao.remove(any[UUID]) returns Future.successful(())

      await(service.clean) must be equalTo tokens
      there was one(dao).findExpired(clock.instant())
      there was one(dao).remove(token1.id)
      there was one(dao).remove(token2.id)
    }
  }

  /**
   * The context.
   */
  trait Context extends Scope {

    /**
     * The current clock.
     */
    val clock = Clock.fixed(Instant.now(), ZoneId.of("UTC"))

    /**
     * The auth token DAO.
     */
    val dao = mock[AuthTokenDAO].smart

    /**
     * The auth token service implementation.
     */
    val service = new AuthTokenServiceImpl(dao, clock)
  }
}
