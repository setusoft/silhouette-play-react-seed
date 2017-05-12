import sbt._

object Dependencies {

  object Version {
    val specs2 = "3.6.6"
    val silhouette = "4.0.0"
    val akka = "2.4.18"
  }

  val resolvers = Seq(
    Resolver.jcenterRepo
  )

  object Library {
    object Play {
      val version: String = play.core.PlayVersion.current
      val ws: ModuleID = "com.typesafe.play" %% "play-ws" % version
      val cache: ModuleID = "com.typesafe.play" %% "play-cache" % version
      val test: ModuleID = "com.typesafe.play" %% "play-test" % version
      val specs2: ModuleID = "com.typesafe.play" %% "play-specs2" % version
    }

    object Specs2 {
      val core: ModuleID = "org.specs2" %% "specs2-core" % Version.specs2
      val matcherExtra: ModuleID = "org.specs2" %% "specs2-matcher-extra" % Version.specs2
      val mock: ModuleID = "org.specs2" %% "specs2-mock" % Version.specs2
    }

    object Silhouette {
      val core: ModuleID = "com.mohiva" %% "play-silhouette" % Version.silhouette
      val passwordBcrypt: ModuleID = "com.mohiva" %% "play-silhouette-password-bcrypt" % Version.silhouette
      val persistence: ModuleID = "com.mohiva" %% "play-silhouette-persistence" % Version.silhouette
      val cryptoJca: ModuleID = "com.mohiva" %% "play-silhouette-crypto-jca" % Version.silhouette
      val testkit: ModuleID = "com.mohiva" %% "play-silhouette-testkit" % Version.silhouette
      val persistenceReactiveMongo: ModuleID = "com.mohiva" %% "play-silhouette-persistence-reactivemongo" % "4.0.2"
    }

    object Akka {
      val testkit: ModuleID = "com.typesafe.akka" %% "akka-testkit" % Version.akka
    }

    val ficus: ModuleID = "com.iheart" %% "ficus" % "1.2.6"
    val scalaGuice: ModuleID = "net.codingwell" %% "scala-guice" % "4.0.1"
    val akkaQuartzScheduler: ModuleID = "com.enragedginger" %% "akka-quartz-scheduler" % "1.5.0-akka-2.4.x"
    val playMailer: ModuleID = "com.typesafe.play" %% "play-mailer" % "5.0.0"
    val apacheCommonsIO: ModuleID = "commons-io" % "commons-io" % "2.4"
    val playReactiveMongo: ModuleID = "org.reactivemongo" %% "play2-reactivemongo" % "0.12.1"
    val embedMongo: ModuleID = "de.flapdoodle.embed" % "de.flapdoodle.embed.mongo" % "2.0.0"
  }
}
