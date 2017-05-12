package auth.models.services

import java.time.Clock
import java.util.UUID
import javax.inject.Inject

import auth.models.AuthToken
import auth.models.daos.AuthTokenDAO
import play.api.libs.concurrent.Execution.Implicits._
import reactivemongo.bson.BSONObjectID

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.postfixOps

/**
 * Handles actions to auth tokens.
 *
 * @param authTokenDAO The auth token DAO implementation.
 * @param clock The clock instance.
 */
class AuthTokenServiceImpl @Inject() (authTokenDAO: AuthTokenDAO, clock: Clock)
  extends AuthTokenService {

  /**
   * Creates a new auth token and saves it in the backing store.
   *
   * @param userID The user ID for which the token should be created.
   * @param expiry The duration a token expires.
   * @return The saved auth token.
   */
  def create(userID: BSONObjectID, expiry: FiniteDuration = 5 minutes): Future[AuthToken] = {
    val expiryDate = clock.instant().plusSeconds(expiry.toSeconds)
    val token = AuthToken(UUID.randomUUID(), userID, expiryDate)
    authTokenDAO.save(token)
  }

  /**
   * Validates a token ID.
   *
   * @param id The token ID to validate.
   * @return The token if it's valid, None otherwise.
   */
  def validate(id: UUID): Future[Option[AuthToken]] = authTokenDAO.find(id)

  /**
   * Cleans expired tokens.
   *
   * @return The list of deleted tokens.
   */
  def clean: Future[Seq[AuthToken]] = {
    authTokenDAO.findExpired(clock.instant()).flatMap { tokens =>
      Future.sequence(tokens.map { token =>
        authTokenDAO.remove(token.id).map(_ => token)
      })
    }
  }
}
