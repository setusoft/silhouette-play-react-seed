import Dependencies.Library
import play.sbt.{ PlayLayoutPlugin, PlayScala }
import sbt._

////*******************************
//// Test module
////*******************************
val test: Project = Project(
  id = "app-test",
  base = file("app-test"),
  settings = Seq(
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
)

////*******************************
//// Core module
////*******************************
val core: Project = Project(
  id = "app-core",
  base = file("app-core"),
  dependencies = Seq(test % Test),
  settings = Seq(
    libraryDependencies ++= Seq(
      Library.apacheCommonsIO,
      Library.playReactiveMongo
    )
  )
).enablePlugins(
  PlayScala, DisablePackageSettings
).disablePlugins(
  PlayLayoutPlugin
)

////*******************************
//// Auth module
////*******************************
val auth: Project = Project(
  id = "app-auth",
  base = file("app-auth"),
  dependencies = Seq(core, test % Test),
  settings = Seq(
    libraryDependencies ++= Seq(
      Library.Silhouette.core,
      Library.Silhouette.passwordBcrypt,
      Library.Silhouette.persistence,
      Library.Silhouette.cryptoJca,
      Library.Silhouette.persistenceReactiveMongo,
      Library.scalaGuice,
      Library.ficus,
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
).enablePlugins(
  PlayScala, DisablePackageSettings
).disablePlugins(
  PlayLayoutPlugin
)

////*******************************
//// Admin module
////*******************************
val admin: Project = Project(
  id = "app-admin",
  base = file("app-admin"),
  dependencies = Seq(auth % "compile->compile;test->test", test % Test)
).enablePlugins(
  PlayScala, DisablePackageSettings
).disablePlugins(
  PlayLayoutPlugin
)

////*******************************
//// Root module
////*******************************
val root: Project = Project(
  id = "silhouette-play-react-seed",
  base = file("."),
  aggregate = Seq(
    test,
    core,
    auth,
    admin
  ),
  dependencies = Seq(
    auth,
    admin
  ),
  settings = Seq(
    libraryDependencies ++= Seq(
      filters
    )
  )
).enablePlugins(
  PlayScala,
  NpmSettings,
  DebianPackageSettings
).disablePlugins(
  PlayLayoutPlugin
)
