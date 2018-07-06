package test

import java.nio.file.Paths

import de.flapdoodle.embed.mongo.config.{ MongodConfigBuilder, Net, RuntimeConfigBuilder }
import de.flapdoodle.embed.mongo.distribution.Version
import de.flapdoodle.embed.mongo.{ Command, MongodProcess, MongodStarter }
import de.flapdoodle.embed.process.runtime.Network
import org.specs2.specification.core.Fragments
import play.api.libs.json.JsObject
import play.api.{ Application, Environment, Logger }
import play.modules.reactivemongo.{ ReactiveMongoApi, ReactiveMongoModule }
import reactivemongo.api.FailoverStrategy
import reactivemongo.api.commands.DropDatabase
import reactivemongo.api.commands.bson.BSONDropDatabaseImplicits._
import reactivemongo.api.commands.bson.CommonImplicits._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.{ Await, Future }

/**
 * A custom specification which starts a MongoDB instance before all the tests, and stops it after all of them.
 *
 * Note: This is handled like a global setup/teardown procedure. So you must clean the database after each test,
 * to get an isolated test case.
 */
trait MongoSpecification extends BaseSpecification {
  sequential
  override def map(fs: => Fragments): Fragments = step(start()) ^ fs ^ step(stop())

  trait MongoContext extends BaseContext {

    /**
     * The application.
     */
    override def application: Application = applicationBuilder
      .configure(MongoConfig.additionalConfig)
      .overrides(new ReactiveMongoModule)
      .build()

    /**
     * Some test fixtures to insert into the database.
     */
    val fixtures: Map[String, Seq[String]] = Map()

    /**
     * The ReactiveMongo API.
     */
    lazy val reactiveMongoAPI = injector.instanceOf[ReactiveMongoApi]

    /**
     * The application environment.
     */
    implicit val env = injector.instanceOf[Environment]

    /**
     * The MongoDB scope.
     */
    trait MongoScope extends BeforeAfterWithinAround {

      /**
       * Inserts the test fixtures.
       */
      def before: Unit = {
        import play.modules.reactivemongo.json._
        Await.result(reactiveMongoAPI.database.flatMap { db =>
          Future.sequence(fixtures.flatMap {
            case (c, files) =>
              val collection = db.collection[JSONCollection](c)
              files.map { file =>
                collection.insert(BaseFixture.load(Paths.get(file)).as[JsObject])
              }
          })
        }, Duration(60, SECONDS))
      }

      /**
       * Drops the database after the test runs to get an isolated environment.
       */
      def after: Unit = {
        Await.result(reactiveMongoAPI.database.flatMap { db =>
          db.runCommand(DropDatabase, FailoverStrategy.default)
        }, Duration(60, SECONDS))
      }
    }
  }

  /**
   * Defines the port on which the embedded Mongo instance should listen.
   *
   * @return The port on which the embedded Mongo instance should listen.
   */
  def embedConnectionPort(): Int = { MongoConfig.MongoPort }

  /**
   * Defines the Mongo version to start.
   *
   * @return The Mongo version to start.
   */
  def embedMongoDBVersion(): Version.Main = { Version.Main.PRODUCTION }

  /**
   * The MongoDB executable.
   */
  lazy val mongodExecutable = MongodStarter
    .getInstance(new RuntimeConfigBuilder()
      .defaultsWithLogger(Command.MongoD, Logger(this.getClass).logger)
      .build()
    )
    .prepare(new MongodConfigBuilder()
      .version(embedMongoDBVersion())
      .net(new Net(embedConnectionPort(), Network.localhostIsIPv6))
      .build
    )

  /**
   * The mongod process.
   */
  var process: Option[MongodProcess] = None

  /**
   * Starts the MongoDB instance.
   */
  private def start(): Unit = {
    process = Some(mongodExecutable.start)
  }

  /**
   * Stops the MongoDB instance.
   */
  private def stop(): Unit = {
    process.foreach(_.stop)
    mongodExecutable.stop()
  }
}

/**
 * The Mongo test config.
 */
object MongoConfig {

  /**
   * The port on which the embedded Mongo instance should listen.
   */
  lazy val MongoPort: Int = sys.env.get("EMBEDDED_MONGO_PORT") match {
    case Some(str) => str.toInt
    case _         => Network.getFreeServerPort
  }

  /**
   * Used to override the default Play configuration for a fake application.
   */
  val additionalConfig = Map(
    "mongodb.uri" -> s"mongodb://localhost:$MongoPort/test"
  )
}
