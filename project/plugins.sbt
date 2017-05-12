libraryDependencies += "org.vafer" % "jdeb" % "1.5" artifacts Artifact("jdeb", "jar", "jar")

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.5.14")

addSbtPlugin("org.scalariform" % "sbt-scalariform" % "1.6.0")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "0.8.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.2.0-M7")

addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.5.0")
