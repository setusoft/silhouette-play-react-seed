package auth.models

import java.time.Instant
import java.util.UUID

import reactivemongo.bson.BSONObjectID

/**
 * A token to authenticate a user against an endpoint for a short time period.
 *
 * @param id     The unique token ID.
 * @param userID The unique ID of the user the token is associated with.
 * @param expiry The date-time the token expires.
 */
case class AuthToken(
  id: UUID,
  userID: BSONObjectID,
  expiry: Instant
)
