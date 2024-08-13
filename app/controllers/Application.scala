package controllers

import com.mohiva.play.silhouette.contrib.services.CachedCookieAuthenticator
import com.mohiva.play.silhouette.core.{Silhouette, Environment}
import play.api._
import play.api.mvc._
import models._
import service.{AbstractService, ConferenceService}
import java.net._
import org.joda.time.DateTime
import scala.collection.JavaConverters._

class Application(implicit val env: Environment[Login, CachedCookieAuthenticator])
  extends Silhouette[Login, CachedCookieAuthenticator] {

  val abstractService = AbstractService()
  val conferenceService = ConferenceService()
  
  def index = UserAwareAction { implicit request =>
    Redirect(routes.Application.conferences()).flashing(request.flash)
  }

  def showUserInfo = UserAwareAction { implicit request =>

    val userName = request.identity match {
      case Some(id: Login) => id.account.fullName + " [" + id.account.firstName + " " + id.account.lastName + "]"
      case _ => "guest"
    }

    Logger.debug(request.uri)
    Logger.debug(request.domain)
    Logger.debug(request.host)
    Ok("Hello %s".format(userName))
  }

  def submission(id: String) = UserAwareAction { implicit request => // TODO should be a secure action
    val user: Account = request.identity match {
      case Some(id: Login) => id.account
      case _               => null
    }

    val conf = conferenceService.get(id)
    Ok(views.html.submission(user, conf, None))
  }

  def edit(id: String) = SecuredAction { implicit request =>
    try {
      val abstr = abstractService.getOwn(id, request.identity.account)

      Ok(views.html.submission(request.identity.account, abstr.conference, Option(abstr)))
    } catch {
      case ia: IllegalAccessException => Forbidden(views.html.error.NotAuthorized())
    }
  }

  def abstractsPublic(confId: String) = UserAwareAction { implicit request =>
    val conference = conferenceService.get(confId)

    Ok(views.html.abstractlist(request.identity.map{ _.account }, conference))
  }

  def locations(confId: String) = UserAwareAction { implicit request =>
    val conference = conferenceService.get(confId)

    Ok(views.html.locations(request.identity.map{ _.account }, conference))
  }

  def floorplans(confId: String) = UserAwareAction { implicit request =>
    val conference = conferenceService.get(confId)

    Ok(views.html.floorplans(request.identity.map{ _.account }, conference))
  }

  def abstractsPrivate = SecuredAction { implicit request =>

    Ok(views.html.dashboard.user(request.identity.account))
  }

  def abstractsFavourite = SecuredAction { implicit request =>
    Ok(views.html.dashboard.favouriteabstracts(request.identity.account))
  }

  def abstractsPending = SecuredAction { implicit request =>
    val conference = conferenceService.list()(0)

    // TODO all abstracts for reviewers
    Ok(views.html.abstractlist(Some(request.identity.account), conference))
  }

  def conferences = UserAwareAction { implicit request =>
    val conferences = conferenceService.list()

    val list_active = conferences.filter(conf => conf.isActive)
    val list_other = conferences.filter(conf => !conf.isActive)

    Ok(views.html.conferencelist(request.identity.map{ _.account }, list_active, list_other))
      .flashing(request.flash)
  }

  def conference(confId: String) = UserAwareAction { implicit request =>
    val conference = conferenceService.get(confId)

    Ok(views.html.conference(request.identity.map{ _.account }, conference))
  }

  def schedule(confId: String) = UserAwareAction { implicit request =>
    val conference = conferenceService.get(confId)

    Ok(views.html.conferenceschedule(request.identity.map{ _.account }, conference))
  }

  def contact = UserAwareAction { implicit request =>
    Ok(views.html.contact(request.identity.map{ _.account }))
  }

  def impressum = UserAwareAction { implicit request =>
    Ok(views.html.impressum(request.identity.map{ _.account }))
  }

  def datenschutz = UserAwareAction { implicit request =>
    Ok(views.html.datenschutz(request.identity.map{ _.account }))
  }

  def about = UserAwareAction { implicit request =>
    Ok(views.html.about(request.identity.map{ _.account }))
  }

  def createConference() = SecuredAction { implicit request =>

    if (!request.identity.account.isAdmin) {
      Unauthorized(views.html.error.NotAuthorized())
    } else {
      Ok(views.html.dashboard.admin.conference(request.identity.account, None))
    }
  }

  def adminConference(confId: String) = SecuredAction { implicit request =>
    val conference = conferenceService.get(confId)

    if (!(conference.isOwner(request.identity.account) || request.identity.account.isAdmin)) {
      Unauthorized("Not allowed!")
    } else {
      Ok(views.html.dashboard.admin.conference(request.identity.account, Some(conference)))
    }
  }

  def adminAbstracts(confId: String) = SecuredAction { implicit request =>
    val conference = conferenceService.get(confId)

    if (!(conference.isOwner(request.identity.account) || request.identity.account.isAdmin)) {
      Unauthorized("Not allowed!")
    } else {
      Ok(views.html.dashboard.admin.abstracts(request.identity.account, conference))
    }
  }

  def adminAccounts() = SecuredAction { implicit request =>
    if (!request.identity.account.isAdmin) {
      Unauthorized("Only site administrators are allowed!")
    } else {
      Ok(views.html.dashboard.admin.accounts(request.identity.account))
    }
  }

  def viewAbstract(id: String) = UserAwareAction { implicit request =>
    val abstr = request.identity match {
      case Some(uid) => abstractService.getOwn(id, uid.account)
      case _         => abstractService.get(id)
    }

    Ok(views.html.abstractviewer(request.identity.map{ _.account }, abstr.conference, abstr))
  }

  def createAppCacheManifest() = UserAwareAction { implicit request =>
    var dynamicViews: String = "";
    var conf = conferenceService.list().head
    dynamicViews += s"""
                       |/conference/${conf.short}
                       |/conference/${conf.short}/schedule
                       |/conference/${conf.short}/submission
                       |/conference/${conf.short}/floorplans
                       |/conference/${conf.short}/locations
                       |/conference/${conf.short}/abstracts""".stripMargin
    for (ban: Banner <- conf.banner.asScala) {
      dynamicViews +=
          s"""
             |/api/banner/${ban.uuid}/imagemobile""".stripMargin
    }
    for (abs: Abstract <- conf.abstracts.asScala) {
      dynamicViews +=
        s"""
           |/abstracts/${abs.uuid}""".stripMargin
      for (fig: Figure <- abs.figures.asScala) {
        dynamicViews +=
          s"""
             |/api/figures/${fig.uuid}/imagemobile""".stripMargin
      }
    }

    Ok(
      s"""CACHE MANIFEST
         |# v1.0.2
         |# Views
         |/conferences
         |/contact
         |/about
         |/impressum
         |/datenschutz
         |# Assets
         |/assets/manifest.json
         |/assets/images/favicon.ico
         |/assets/images/favicon.png
         |/assets/images/bccn.png
         |/assets/images/gnode_logo.png
         |/assets/images/jnode_logo.png
         |/assets/stylesheets/print.css
         |/assets/stylesheets/style.css
         |# libs
         |/assets/javascripts/lib/accessors.js
         |/assets/javascripts/lib/astate.js
         |/assets/javascripts/lib/models.js
         |/assets/javascripts/lib/msg.js
         |/assets/javascripts/lib/multi.js
         |/assets/javascripts/lib/offline.js
         |/assets/javascripts/lib/owned.js
         |/assets/javascripts/lib/tools.js
         |/assets/javascripts/lib/update-storage.js
         |/assets/javascripts/lib/validate.js
         |# View Models
         |/assets/javascripts/abstract-list.js
         |/assets/javascripts/abstract-viewer.js
         |/assets/javascripts/abstract-favourite.js
         |/assets/javascripts/browser.js
         |/assets/javascripts/conference-schedule.js
         |/assets/javascripts/config.js
         |/assets/javascripts/editor.js
         |/assets/javascripts/locations.js
         |/assets/javascripts/main.js
         |/assets/javascripts/userdash.js
         |# WebJars
         |/assets/lib/bootstrap/js/bootstrap.bundle.min.js
         |/assets/lib/bootstrap/css/bootstrap.min.css
         |/assets/lib/datetimepicker/build/jquery.datetimepicker.full.min.js
         |/assets/lib/datetimepicker/build/jquery.datetimepicker.min.css
         |/assets/lib/dhtmlx-scheduler/codebase/dhtmlxscheduler.js
         |/assets/lib/dhtmlx-scheduler/codebase/dhtmlxscheduler.css
         |/assets/lib/dayjs/dayjs.min.js
         |/assets/lib/dayjs/plugin/calendar.js
         |/assets/lib/font-awesome/css/all.min.css
         |/assets/lib/jquery/jquery.min.js
         |/assets/lib/jquery-mousewheel/jquery.mousewheel.js
         |/assets/lib/jquery-ui/jquery-ui.min.js
         |/assets/lib/jquery-ui/jquery-ui.min.css
         |/assets/lib/knockout/knockout.js
         |/assets/lib/knockout-sortable/build/knockout-sortable.min.js
         |/assets/lib/leaflet/dist/leaflet.js
         |/assets/lib/leaflet/dist/leaflet.css
         |/assets/lib/mathjax/es5/tex-mml-chtml.js
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_AMS-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Bold.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Bold.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Bold.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Italic.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-BoldItalic.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-Italic.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Bold.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Italic.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Script-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size1-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size2-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size3-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size4-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Typewriter-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Bold.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Regular.woff
         |/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Zero.woff
         |/assets/lib/requirejs/require.min.js
         |/assets/lib/sammy/sammy.min.js
         |# Online Resources
         |https://fonts.googleapis.com/css?family=EB+Garamond|Open+Sans
         |# Style Sources
         |/assets/stylesheets/_bootstrap_custom.scss
         |/assets/stylesheets/print.scss
         |/assets/stylesheets/style.scss
         |
         |# Dynamic Views
         |${dynamicViews}
         |
         |NETWORK:
         |*
         |http:/*
         |https:/*
         """.stripMargin).as("text/cache-manifest")
  }

}
