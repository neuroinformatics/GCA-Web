// Comment to get more information during initialization
logLevel := Level.Warn

resolvers += "typesafe-maven-releases" at "https://repo.typesafe.com/typesafe/maven-releases/"

// The Play plugin
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.3.10")

// SBT web plugins
addSbtPlugin("io.github.irundaia" % "sbt-sassify" % "1.5.2")

// TODO clean up js code until it passes jshint and uncomment next line
// addSbtPlugin("com.typesafe.sbt" % "sbt-jshint" % "1.0.2")

addSbtPlugin("com.typesafe.sbt" % "sbt-rjs" % "1.0.10")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.4")

addSbtPlugin("com.typesafe.sbt" % "sbt-gzip" % "1.0.2")

// SBT enabling a super-fast development turnaround - sbt ~reStart
addSbtPlugin("io.spray" % "sbt-revolver" % "0.9.1") // for SBT 0.13
// addSbtPlugin("io.spray" % "sbt-revolver" % "0.10.0") // for SBT 1.X
