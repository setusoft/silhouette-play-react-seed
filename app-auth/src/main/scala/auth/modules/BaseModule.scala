package auth.modules

import auth.jobs.{ AuthTokenCleaner, Scheduler }
import auth.models.daos._
import auth.models.services.{ AuthTokenService, AuthTokenServiceImpl }
import com.google.inject.Provides
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.util._
import com.mohiva.play.silhouette.impl.providers._
import com.mohiva.play.silhouette.password.BCryptPasswordHasher
import com.mohiva.play.silhouette.persistence.daos.{ DelegableAuthInfoDAO, MongoAuthInfoDAO }
import com.mohiva.play.silhouette.persistence.repositories.DelegableAuthInfoRepository
import net.codingwell.scalaguice.ScalaModule
import play.api.Configuration
import play.api.libs.concurrent.AkkaGuiceSupport
import play.modules.reactivemongo.ReactiveMongoApi

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * The Guice `Main` module.
 */
class BaseModule extends ScalaModule with AkkaGuiceSupport {

  /**
   * Configures the module.
   */
  def configure(): Unit = {
    bindActor[AuthTokenCleaner](AuthTokenCleaner.Name)
    bind[Scheduler].asEagerSingleton()

    bind[AuthTokenDAO].to[AuthTokenDAOImpl]
    bind[AuthTokenService].to[AuthTokenServiceImpl]

    bind[PasswordHasher].toInstance(new BCryptPasswordHasher)
  }

  /**
   * Provides the implementation of the delegable `PasswordInfo` auth info DAO.
   *
   * @param reactiveMongoApi The ReactiveMongo API.
   * @param configuration    The Play configuration.
   * @return The implementation of the delegable `PasswordInfo` auth info DAO.
   */
  @Provides
  def providePasswordInfoDAO(
    reactiveMongoApi: ReactiveMongoApi,
    configuration: Configuration
  ): DelegableAuthInfoDAO[PasswordInfo] = {
    import auth.utils.json.MongoFormats._
    new MongoAuthInfoDAO[PasswordInfo](reactiveMongoApi, configuration)
  }

  /**
   * Provides the auth info repository.
   *
   * @param passwordInfoDAO The implementation of the delegable password auth info DAO.
   * @return The auth info repository instance.
   */
  @Provides
  def provideAuthInfoRepository(
    passwordInfoDAO: DelegableAuthInfoDAO[PasswordInfo]
  ): AuthInfoRepository = {
    new DelegableAuthInfoRepository(passwordInfoDAO)
  }

  /**
   * Provides the password hasher registry.
   *
   * @param passwordHasher The default password hasher implementation.
   * @return The password hasher registry.
   */
  @Provides
  def providePasswordHasherRegistry(passwordHasher: PasswordHasher): PasswordHasherRegistry = {
    PasswordHasherRegistry(passwordHasher)
  }

  /**
   * Provides the credentials provider.
   *
   * @param authInfoRepository     The auth info repository implementation.
   * @param passwordHasherRegistry The password hasher registry.
   * @return The credentials provider.
   */
  @Provides
  def provideCredentialsProvider(
    authInfoRepository: AuthInfoRepository,
    passwordHasherRegistry: PasswordHasherRegistry
  ): CredentialsProvider = {
    new CredentialsProvider(authInfoRepository, passwordHasherRegistry)
  }
}
