package test

import org.specs2.matcher.{ JsonMatchers, MatchResult }
import play.api.http.MimeTypes
import play.api.libs.json.{ Json, Reads }
import play.api.mvc.{ Controller, Result }

import scala.concurrent.Future
import scala.reflect.ClassTag

/**
 * A specification which contains some API helpers.
 */
trait ApiSpecification extends BaseSpecification with JsonMatchers {

  /**
   * A context.
   *
   * @tparam T The controller type.
   */
  abstract class ApiContext[T <: Controller: ClassTag] extends BaseContext {

    /**
     * A form error representation.
     *
     * @param key     The field key.
     * @param message The error message.
     */
    case class FormError(key: String, message: String)
    object FormError {
      implicit val format = Json.format[FormError]
    }

    /**
     * The API controller to test.
     */
    lazy val controller: T = application.injector.instanceOf[T]

    /**
     * Helper class which validates against an API response.
     *
     * @param httpStatus  The HTTP status code.
     * @param result      The Play result.
     * @param code        The code to match against.
     * @param description The description to match against.
     * @param details     The details to match against.
     */
    class Response[D: Reads](
      httpStatus: Int,
      result: Future[Result],
      code: String,
      description: String,
      details: D
    ) {

      /**
       * Validates the response.
       *
       * @return A Specs2 match result.
       */
      def validate: MatchResult[D] = {
        val json = contentAsString(result)

        status(result) must equalTo(httpStatus)
        contentType(result) must beSome(MimeTypes.JSON)

        json must /("code" -> code)
        json must /("description" -> description)

        val parsedJson = Json.parse(json)
        val parsedDetails = parsedJson \ "details"

        details must be equalTo parsedDetails.validate[D].get
      }
    }

    /**
     * The companion object.
     */
    object Response {
      def apply[D: Reads](
        httpStatus: Int,
        result: Future[Result],
        code: String,
        description: String,
        details: D
      ): MatchResult[D] = {
        new Response(httpStatus, result, code, description, details).validate
      }

      def apply(
        httpStatus: Int,
        result: Future[Result],
        code: String,
        description: String
      ): MatchResult[List[String]] = {
        new Response[List[String]](httpStatus, result, code, description, List()).validate
      }
    }
  }
}
