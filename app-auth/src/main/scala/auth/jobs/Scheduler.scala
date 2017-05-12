package auth.jobs

import akka.actor.{ ActorRef, ActorSystem }
import com.google.inject.Inject
import com.google.inject.name.Named
import com.typesafe.akka.extension.quartz.QuartzSchedulerExtension

/**
 * Schedules the jobs.
 *
 * @param system           The actor system.
 * @param quartzScheduler  The Quartz scheduler.
 * @param authTokenCleaner The auth token cleaner actor.
 */
class Scheduler @Inject() (
  system: ActorSystem,
  quartzScheduler: QuartzSchedulerExtension,
  @Named(AuthTokenCleaner.Name) authTokenCleaner: ActorRef
) {
  quartzScheduler.schedule("AuthTokenCleaner", authTokenCleaner, AuthTokenCleaner.Clean)
  authTokenCleaner ! AuthTokenCleaner.Clean
}
