package core.models.services

import java.time.{ Clock, Instant, ZoneId }

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.impl.providers.{ CommonSocialProfile, CredentialsProvider }
import core.models.daos.UserDAO
import core.models.{ Registration, Settings, User }
import org.specs2.control.NoLanguageFeatures
import org.specs2.mock.Mockito
import org.specs2.specification.Scope
import play.api.http.HeaderNames
import play.api.i18n.Lang
import play.api.test.{ FakeRequest, PlaySpecification }
import reactivemongo.bson.BSONObjectID

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.language.postfixOps

/**
 * Test case for the [[UserServiceImpl]] class.
 */
class UserServiceImplSpec extends PlaySpecification with Mockito with NoLanguageFeatures {

  "The `find` method" should {
    "find a user for the given login info" in new Context {
      dao.find(loginInfo) returns Future.successful(Some(user))

      await(service.retrieve(loginInfo)) must beSome(user)
      there was one(dao).find(loginInfo)
    }

    "find a user for the given ID" in new Context {
      dao.find(userID) returns Future.successful(Some(user))

      await(service.retrieve(userID)) must beSome(user)
      there was one(dao).find(userID)
    }

    "return None if no user for the given login info exists" in new Context {
      dao.find(loginInfo) returns Future.successful(None)

      await(service.retrieve(loginInfo)) must beNone
      there was one(dao).find(loginInfo)
    }

    "return None if no user for the given ID exists" in new Context {
      dao.find(userID) returns Future.successful(None)

      await(service.retrieve(userID)) must beNone
      there was one(dao).find(userID)
    }
  }

  "The `save` method" should {
    "saves the given user" in new Context {
      dao.save(user) returns Future.successful(user)

      await(service.save(user)) must be equalTo user
      there was one(dao).save(user)
    }

    "updates a user based on the given common social profile" in new Context {
      implicit val request = FakeRequest()
      implicit val lang = Lang("en-US")

      dao.save(user) returns Future.successful(user)

      dao.find(profile.loginInfo) returns Future.successful(Some(user))

      await(service.save(profile)) must be equalTo user
      there was one(dao).save(user)
    }

    "saves a user based on the given common social profile" in new Context {
      implicit val request = FakeRequest().withHeaders(
        HeaderNames.HOST -> "localhost:9000",
        HeaderNames.USER_AGENT -> "Chrome/58.0.3029.81 Safari/537.36"
      )
      implicit val lang = Lang("en-US")

      dao.save(any[User]) answers { a => Future.successful(a.asInstanceOf[User]) }
      dao.find(profile.loginInfo) returns Future.successful(None)

      val u = await(service.save(profile))
      u.loginInfo must be equalTo Seq(loginInfo)
      u.name must be equalTo user.name
      u.email must be equalTo user.email
      u.avatarURL must be equalTo user.avatarURL
      u.registration must be equalTo user.registration
      u.settings must be equalTo user.settings

      there was one(dao).save(any[User])
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
     * A userID for the stored user.
     */
    val userID = BSONObjectID.parse("590998e65e00005e0095f1ce").get

    /**
     * A login info for the stored user.
     */
    val loginInfo = LoginInfo(CredentialsProvider.ID, "john@doe.com")

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
        dateTime = clock.instant()
      ),
      settings = Settings(
        lang = Lang("en-US")
      )
    )

    /**
     * A common social profile.
     */
    val profile = CommonSocialProfile(
      loginInfo = loginInfo,
      firstName = Some("John"),
      lastName = Some("Doe"),
      fullName = Some("John Doe"),
      email = Some("john@doe.com"),
      avatarURL = None
    )

    /**
     * The user DAO.
     */
    val dao = mock[UserDAO].smart

    /**
     * The user service implementation.
     */
    val service = new UserServiceImpl(dao, clock)
  }
}
