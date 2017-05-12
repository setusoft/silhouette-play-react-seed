package auth

import java.time.Instant

import auth.models.{ Registration, Settings, User }
import auth.utils.{ CustomSecuredErrorHandler, CustomUnsecuredErrorHandler, DefaultEnv }
import com.mohiva.play.silhouette.api.actions._
import com.mohiva.play.silhouette.api.{ Environment, LoginInfo, Silhouette, SilhouetteProvider }
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import com.mohiva.play.silhouette.test.FakeEnvironment
import net.codingwell.scalaguice.ScalaModule
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import reactivemongo.bson.BSONObjectID
import test.BaseSpecification

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * A specification which contains some auth specific configuration.
 */
trait AuthSpecification extends BaseSpecification {

  /**
   * A context.
   */
  trait AuthContext extends BaseContext {

    /**
     * A test email.
     */
    val email = "john@doe.com"

    /**
     * The login info for the user.
     */
    val loginInfo = LoginInfo(CredentialsProvider.ID, email)

    /**
     * A dummy user.
     */
    val user = User(
      id = BSONObjectID.generate(),
      loginInfo = Seq(loginInfo),
      name = Some("Jon Doe"),
      email = Some(email),
      avatarURL = None,
      registration = Registration(
        lang = lang,
        ip = "0:0:0:0:0:0:0:1",
        host = Some("localhost:9000"),
        userAgent = Some("Chrome/57.0.2987.133 Safari/537.36"),
        activated = true,
        dateTime = Instant.now()
      ),
      settings = Settings(
        lang = lang
      )
    )

    /**
     * The fake environment.
     */
    implicit val fakeEnv = FakeEnvironment[DefaultEnv](Seq(loginInfo -> user))

    /**
     * The silhouette module used to instantiate the application.
     */
    def silhouetteModule: ScalaModule = new ScalaModule {
      def configure(): Unit = {
        bind[Environment[DefaultEnv]].toInstance(fakeEnv)
        bind[Silhouette[DefaultEnv]].to[SilhouetteProvider[DefaultEnv]]
      }
    }

    /**
     * The application builder.
     */
    override def applicationBuilder: GuiceApplicationBuilder =
      super.applicationBuilder
        // Must be configured because of https://github.com/playframework/playframework/issues/7310
        .disable[SecuredErrorHandlerModule]
        .disable[UnsecuredErrorHandlerModule]
        .bindings(bind[UnsecuredErrorHandler].to[CustomUnsecuredErrorHandler])
        .bindings(bind[SecuredErrorHandler].to[CustomSecuredErrorHandler])
        // -> END
        .overrides(silhouetteModule)
  }
}
