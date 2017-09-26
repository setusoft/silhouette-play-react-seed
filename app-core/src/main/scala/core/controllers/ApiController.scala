package core.controllers

import play.api.data.FormError
import play.api.http.Writeable
import play.api.i18n.{ I18nSupport, Messages, MessagesProvider }
import play.api.libs.json.Writes._
import play.api.libs.json._
import play.api.mvc.BaseController

/**
 * The base API controller.
 */
trait ApiController extends BaseController with I18nSupport {

  /**
   * Straightforward `Writeable` for ApiResponse[T] values.
   */
  implicit def apiResponseWritable[T](
    implicit
    jsonWrites: Writes[T],
    jsonWritable: Writeable[JsValue]
  ): Writeable[ApiResponse[T]] = {
    jsonWritable.map(response => Json.toJson(response))
  }

  /**
   * A JSON writes for a Play `FormError` instance.
   *
   * @param provider The Play message provider.
   * @return A JSON writes.
   */
  implicit def formErrorWrites(implicit provider: MessagesProvider): Writes[FormError] = {
    OWrites[FormError] { error =>
      Json.obj(
        "key" -> error.key,
        "message" -> Messages(error.message, error.args: _*)
      )
    }
  }

  /**
   * An API response.
   *
   * @param code        The response code.
   * @param description The response description.
   * @param details     A list with details.
   * @tparam T The type of the detail.
   */
  case class ApiResponse[T](code: String, description: String, details: T)
  object ApiResponse {
    def apply(code: String, description: String): ApiResponse[List[String]] = {
      ApiResponse(code, description, List())
    }
    implicit def jsonWrites[T](implicit detail: Writes[T]): Writes[ApiResponse[T]] = {
      OWrites[ApiResponse[T]] { response =>
        Json.obj(
          "code" -> response.code,
          "description" -> response.description,
          "details" -> detail.writes(response.details)
        )
      }
    }
  }
}
