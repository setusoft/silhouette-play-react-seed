package core.exceptions

/**
 * Indicates that an error occurred during a Mongo query.
 *
 * @param msg   The error message.
 * @param cause The exception cause.
 */
class MongoException(msg: String, cause: Option[Throwable] = None)
  extends RuntimeException(msg, cause.orNull)
