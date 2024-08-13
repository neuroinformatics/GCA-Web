
name := "GCA-Web"

version := "1.0"

lazy val `GCA-Web`: Project = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.12"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "org.scalatest" %% "scalatest" % "2.2.1",
  "org.eclipse.persistence" % "org.eclipse.persistence.jpa" % "2.5.2",
  "com.typesafe.play" %% "play-mailer" % "2.4.0",
  "com.mohiva" %% "play-silhouette" % "1.0",
  "com.sksamuel.scrimage" %% "scrimage-core" % "2.1.7",
  "org.postgresql" % "postgresql" % "42.7.3",
  "org.commonmark" % "commonmark" % "0.21.0",
  // web jars
  "org.webjars" % "requirejs" % "2.3.6",
  "org.webjars" % "jquery" % "3.7.1",
  "org.webjars" % "jquery-ui" % "1.13.3",
  "org.webjars" % "bootstrap" % "5.3.3",
  "org.webjars" % "font-awesome" % "6.5.2",
  "org.webjars" % "sammy" % "0.7.4",
  "org.webjars" % "knockout" % "3.5.1",
  "org.webjars.npm" % "knockout-sortable" % "1.2.0",
  "org.webjars" % "datetimepicker" % "2.5.20-1",
  "org.webjars.npm" % "jquery-mousewheel" % "3.1.13",
  "org.webjars.npm" % "dayjs" % "1.11.11",
  "org.webjars.npm" % "leaflet" % "1.9.4",
  "org.webjars.npm" % "dhtmlx-scheduler" % "7.0.5",
  "org.webjars.npm" % "mathjax" % "3.2.2",
  "com.googlecode.owasp-java-html-sanitizer" % "owasp-java-html-sanitizer" % "20240325.1"
)
