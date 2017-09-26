import java.io.File

import NpmPlugin.autoImport._
import play.routes.compiler.InjectedRoutesGenerator
import play.sbt.PlayImport.PlayKeys
import play.sbt.routes.RoutesKeys.routesGenerator
import play.sbt.{ Play, PlayScala }
import play.twirl.sbt.Import.TwirlKeys
import sbt.Keys.{ baseDirectory, publishArtifact, sources, unmanagedResourceDirectories, _ }
import sbt._

////*******************************
//// Basic settings
////*******************************
object BasicSettings extends AutoPlugin {
  override def trigger: PluginTrigger = allRequirements

  override def projectSettings: Seq[Setting[_]] = Seq(
    organization := "your.organisation",
    version := "5.0.0",
    resolvers ++= Dependencies.resolvers,
    scalaVersion := crossScalaVersions.value.head,
    crossScalaVersions := Seq("2.12.3"),
    scalacOptions ++= Seq(
      "-deprecation", // Emit warning and location for usages of deprecated APIs.
      "-feature", // Emit warning and location for usages of features that should be imported explicitly.
      "-unchecked", // Enable additional warnings where generated code depends on assumptions.
      "-Xfatal-warnings", // Fail the compilation if there are any warnings.
      //"-Xlint", // Enable recommended additional warnings.
      "-Ywarn-adapted-args", // Warn if an argument list is modified to match the receiver.
      "-Ywarn-dead-code", // Warn when dead code is identified.
      "-Ywarn-inaccessible", // Warn about inaccessible types in method signatures.
      "-Ywarn-nullary-override", // Warn when non-nullary overrides nullary, e.g. def foo() over def foo.
      "-Ywarn-numeric-widen", // Warn when numerics are widened.
      // Play has a lot of issues with unused imports and unsued params
      // https://github.com/playframework/playframework/issues/6690
      // https://github.com/playframework/twirl/issues/105
      "-Xlint:-unused,_"
    ),
    scalacOptions in Test ~= { (options: Seq[String]) =>
      options filterNot (_ == "-Ywarn-dead-code") // Allow dead code in tests (to support using mockito).
    },
    parallelExecution in Test := false,
    fork in Test := true
  )
}

////*******************************
//// Play settings
////*******************************
object PlaySettings extends AutoPlugin {
  override def requires: Plugins = Play

  override def projectSettings: Seq[Setting[_]] =
    Seq(
      // Monitor Twirl templates with SBT layout
      PlayKeys.playMonitoredFiles ++= (sourceDirectories in (Compile, TwirlKeys.compileTemplates)).value,

      // Router settings
      routesGenerator := InjectedRoutesGenerator,

      // https://github.com/playframework/twirl/issues/105
      TwirlKeys.templateImports := Seq(),

      // Disable documentation
      sources in (Compile, doc) := Seq.empty,
      publishArtifact in (Compile, packageDoc) := false
    )
}

////*******************************
//// Doc settings
////*******************************
object DocSettings extends AutoPlugin {

  override def trigger: PluginTrigger = allRequirements

  // Disable documentation creation
  override def projectSettings: Seq[Setting[_]] = Seq(
    publishArtifact in (Compile, packageDoc) := false,
    publishArtifact in packageDoc := false,
    sources in (Compile, doc) := Seq.empty
  )
}

////*******************************
//// NPM settings
////*******************************
object NpmSettings extends AutoPlugin {
  import com.typesafe.sbt.web.Import._

  override def requires: Plugins = NpmPlugin

  override def trigger: PluginTrigger = noTrigger

  override def projectSettings: Seq[Setting[_]] = Seq(
    // We use the dev command to start the server in development mode, otherwise it cannot be killed
    npmStart in Npm := "start",

    // We must define the directory in which the NPM project is located
    npmDir in Npm := "app-ui",

    // Make the dist files available for Play, so that they can be accessed with `routes.Assets.at`.
    // This does only work in production mode. In development mode the files where served through the
    // node.js server.
    unmanagedResourceDirectories in Assets += baseDirectory.value / "target/npm/dist"
  )
}

////*******************************
//// Package settings
////*******************************
object DebianPackageSettings extends AutoPlugin {
  import com.typesafe.sbt.SbtNativePackager.autoImport.{ maintainer, packageDescription, packageSummary }
  import com.typesafe.sbt.packager.archetypes.systemloader.SystemdPlugin
  import com.typesafe.sbt.packager.debian.DebianPlugin.autoImport._
  import com.typesafe.sbt.packager.debian.{ DebianPlugin, JDebPackaging }
  import com.typesafe.sbt.packager.universal.UniversalPlugin.autoImport.dist

  override def requires: Plugins = DebianPlugin && JDebPackaging && SystemdPlugin && NpmPlugin

  override def trigger: PluginTrigger = noTrigger

  override def projectSettings: Seq[Setting[_]] = Seq(
    maintainer in Debian := "John Doe <john@doe.com>",
    packageSummary in Debian := "Silhouette Play React Seed Template",
    packageDescription in Debian := "Silhouette Play React Seed Template",
    debianPackageDependencies in Debian ++= Seq("openjdk-8-jre", "nginx", "bash"),
    packageBin in Debian := (packageBin in Debian).dependsOn(dist in Npm).value
  )
}

////*******************************
//// Disable Package settings
////*******************************
object DisablePackageSettings extends AutoPlugin {
  import com.typesafe.sbt.packager.debian.DebianPlugin
  import com.typesafe.sbt.packager.debian.DebianPlugin.autoImport._

  override def requires: Plugins = PlayScala && DebianPlugin

  override def trigger: PluginTrigger = noTrigger

  // http://stackoverflow.com/questions/37066566/playframework-sbt-native-packager-disable-subproject-packageing
  override def projectSettings: Seq[Setting[_]] = Seq(
    packageBin in Debian := File.createTempFile("sbt", ".tmp")
  )
}
