package test

import java.time.{ Clock, Instant, ZoneId }

import net.codingwell.scalaguice.ScalaModule
import org.specs2.specification.Scope
import play.api.i18n.{ Lang, Messages, MessagesApi }
import play.api.inject.Injector
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.PlaySpecification
import play.api.{ Application, Configuration }

/**
 * A specification which contains some helpers.
 */
trait BaseSpecification extends PlaySpecification {

  /**
   * The base context.
   */
  trait BaseContext extends Scope {

    /**
     * The fake module used to instantiate the application.
     */
    def fakeModule: ScalaModule = new ScalaModule {
      def configure(): Unit = {}
    }

    /**
     * The list of modules to disable.
     *
     * Override this to disable modules during testing.
     *
     * @return The list of modules to disable.
     */
    def disabledModules: List[String] = List(
      "modules.JobModule",
      "modules.QuartzSchedulerModule"
    )

    /**
     * The application builder.
     */
    def applicationBuilder: GuiceApplicationBuilder = GuiceApplicationBuilder(
      loadConfiguration = { environment =>
        val config = Configuration.load(environment)
        config ++ Configuration(
          "play.modules.disabled" -> (config.get[Seq[String]]("play.modules.disabled") ++ disabledModules)
        )
      })
      .overrides(fakeModule)

    /**
     * The application.
     */
    def application: Application = applicationBuilder.build()

    /**
     * The Guice injector.
     */
    def injector: Injector = application.injector

    /**
     * The Play lang.
     */
    def lang: Lang = Lang("en-US")

    /**
     * The Play messages.
     */
    implicit def messages: Messages = application.injector.instanceOf[MessagesApi].preferred(Seq(lang))

    /**
     * The current clock.
     */
    lazy val clock: Clock = Clock.fixed(Instant.now(), ZoneId.of("UTC"))
  }
}
