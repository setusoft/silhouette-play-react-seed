libraryDependencies += "org.vafer" % "jdeb" % "1.5" artifacts Artifact("jdeb", "jar", "jar")

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.6.7")

addSbtPlugin("org.scalariform" % "sbt-scalariform" % "1.8.2")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "1.0.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.3.2")

addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.5.1")
