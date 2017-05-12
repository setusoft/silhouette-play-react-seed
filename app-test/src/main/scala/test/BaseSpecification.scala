package test

import java.time.{ Clock, Instant, ZoneId }

import net.codingwell.scalaguice.ScalaModule
import org.specs2.specification.Scope
import play.api.Application
import play.api.i18n.{ Lang, Messages, MessagesApi }
import play.api.inject.Injector
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.PlaySpecification

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
     * The application builder.
     */
    def applicationBuilder: GuiceApplicationBuilder = new GuiceApplicationBuilder()
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
    implicit def messages: Messages = Messages(lang, application.injector.instanceOf[MessagesApi])

    /**
     * The current clock.
     */
    lazy val clock = Clock.fixed(Instant.now(), ZoneId.of("UTC"))
  }
}
