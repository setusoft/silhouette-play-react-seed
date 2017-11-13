package test

import java.io.{ FileNotFoundException, InputStream }
import java.net.URL
import java.nio.file._
import java.util.UUID

import play.api.libs.Files.{ SingletonTemporaryFileCreator, TemporaryFile }
import play.api.libs.json.{ JsValue, Json, Reads }
import play.api.mvc.MultipartFormData
import play.api.mvc.MultipartFormData.FilePart

import scala.xml.{ Elem, XML }

/**
 * Fixture helpers.
 */
trait BaseFixture {
  type F <: BaseFixtureConverter

  /**
   * The path separator.
   */
  val Separator: String = FileSystems.getDefault.getSeparator

  /**
   * Converts the fixture in different types.
   */
  trait BaseFixtureConverter {
    val inputStream: InputStream
    val path: Path

    def asString: String = scala.io.Source.fromInputStream(inputStream)(scala.io.Codec("UTF-8")).mkString
    def asJson: JsValue = Json.parse(asString)
    def asXml: Elem = XML.load(inputStream)
    def asMultipartFormData(contentType: Option[String] = None): MultipartFormData[TemporaryFile] = {
      val tempFile = SingletonTemporaryFileCreator.create("test-fixture", UUID.randomUUID().toString)
      Files.copy(inputStream, tempFile, StandardCopyOption.REPLACE_EXISTING)

      MultipartFormData[TemporaryFile](
        dataParts = Map.empty,
        files = Seq(
          FilePart(
            key = "test-fixture",
            filename = tempFile.toPath.getFileName.toString,
            contentType = contentType,
            ref = tempFile
          )
        ),
        badParts = Nil)
    }
    def as[T](implicit fjs: Reads[T]): T = asJson.as[T]
  }

  /**
   * Wraps the stream with the fixture converter.
   *
   * @param inputStream The input stream of the fixture.
   * @param path        The fixture path.
   * @return The test fixture.
   */
  def wrap(inputStream: InputStream, path: Path): F

  /**
   * Loads a test fixture.
   *
   * @param path The fixture path.
   * @return The test fixture.
   */
  def load(path: Path): F = load(this.getClass.getClassLoader, path)

  /**
   * Loads a test fixture.
   *
   * @param classLoader The class loader to use to load the fixture.
   * @param path The fixture path.
   * @return The test fixture.
   */
  def load(classLoader: ClassLoader, path: Path): F = {
    wrap(Option(classLoader.getResourceAsStream(path.toString)) match {
      case Some(is) => is
      case None     => throw new FileNotFoundException("Cannot load test fixture: " + path)
    }, path)
  }

  /**
   * Gets a path for a fixture from class path.
   *
   * @param path The fixture path.
   * @return The path to the fixture.
   */
  def path(path: Path): Path = this.path(this.getClass.getClassLoader, path)

  /**
   * Gets a path for a fixture from class path.
   *
   * @param classLoader The class loader to use to load the fixture.
   * @param path The fixture path.
   * @return The path to the fixture.
   */
  def path(classLoader: ClassLoader, path: Path): Path = {
    val crossPlatformPath = path.toString.stripPrefix(Separator).replace(Separator, "/")
    val url: URL = Option(classLoader.getResource(crossPlatformPath)).getOrElse {
      throw new FileNotFoundException("Cannot find test file: " + path)
    }

    // On Windows the URL will be prepended with a "/", so it will return /C:/ as example. We must remove the
    // prefixed slash, otherwise it's not a valid path and the Paths.get method throws an exception
    val windowsDirPattern = "/([A-Z]{1}:.*)".r
    url.getFile match {
      case windowsDirPattern(p) => Paths.get(p)
      case p                    => Paths.get(p)
    }
  }
}

/**
 * Base fixture helpers.
 */
object BaseFixture extends BaseFixture {
  override type F = FixtureConverter

  /**
   * Converts the fixture in different types.
   *
   * @param inputStream The input stream of the fixture.
   * @param path        The fixture path.
   */
  case class FixtureConverter(inputStream: InputStream, path: Path) extends BaseFixtureConverter

  /**
   * Wraps the stream with the fixture converter.
   *
   * @param inputStream The input stream of the fixture.
   * @param path        The fixture path.
   * @return The test fixture.
   */
  override def wrap(inputStream: InputStream, path: Path): F = FixtureConverter(inputStream, path)
}
