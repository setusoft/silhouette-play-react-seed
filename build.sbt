import Dependencies.Library
import play.sbt.{ PlayLayoutPlugin, PlayScala }
import sbt._

////*******************************
//// Test module
////*******************************
val test: Project = Project(id = "app-test", base = file("app-test"))
  .settings(
    libraryDependencies ++= Seq(
      Library.Play.test,
      Library.Play.specs2,
      Library.Akka.testkit,
      Library.Specs2.matcherExtra,
      Library.scalaGuice,
      Library.playReactiveMongo,
      Library.embedMongo,
      filters
    )
  )

////*******************************
//// Core module
////*******************************
val core: Project = Project(id = "app-core", base = file("app-core"))
  .dependsOn(test % Test)
  .settings(
    libraryDependencies ++= Seq(
      Library.ficus,
      Library.scalaGuice,
      Library.apacheCommonsIO,
      Library.playReactiveMongo,
      Library.Silhouette.core,
      Library.Silhouette.cryptoJca,
      Library.Silhouette.testkit % Test,
    )
  )
  .enablePlugins(PlayScala, DisablePackageSettings)
  .disablePlugins(PlayLayoutPlugin)

////*******************************
//// Auth module
////*******************************
val auth: Project = Project(id = "app-auth", base = file("app-auth"))
  .dependsOn(core % "compile->compile;test->test", test % Test)
  .settings(
    libraryDependencies ++= Seq(
      Library.Silhouette.passwordBcrypt,
      Library.Silhouette.persistence,
      Library.Silhouette.persistenceReactiveMongo,
      Library.scalaGuice,
      Library.playMailer,
      Library.playMailerGuice,
      Library.akkaQuartzScheduler,
      Library.Silhouette.testkit % Test,
      Library.Specs2.matcherExtra % Test,
      Library.Akka.testkit % Test,
      ws,
      guice,
      specs2 % Test
    )
  )
  .enablePlugins(PlayScala, DisablePackageSettings)
  .disablePlugins(PlayLayoutPlugin)

////*******************************
//// Admin module
////*******************************
val admin: Project = Project(id = "app-admin", base = file("app-admin"))
  .dependsOn(core % "compile->compile;test->test", test % Test)
  .enablePlugins(PlayScala, DisablePackageSettings)
  .disablePlugins(PlayLayoutPlugin)

////*******************************
//// Root module
////*******************************
val root: Project = Project(id = "silhouette-play-react-seed", base = file("."))
  .aggregate(test, core, auth, admin)
  .dependsOn(auth, admin)
  .settings(
    libraryDependencies ++= Seq(
      filters
    )
  )
  .enablePlugins(PlayScala, NpmSettings, PackageSettings)
  .disablePlugins(PlayLayoutPlugin)
