package controllers

import com.mohiva.play.silhouette.contrib.services.CachedCookieAuthenticator
import com.mohiva.play.silhouette.core.{Environment, Silhouette}
import models.Login

/**
  * Created by garbers on 04.05.17.
  */
class Mobile (implicit val env: Environment[Login, CachedCookieAuthenticator])
  extends Silhouette[Login, CachedCookieAuthenticator] {

  def Conferences = UserAwareAction { implicit request =>
    Redirect("/conferences", MOVED_PERMANENTLY)
  }

  def Conference(confId: String) = UserAwareAction { implicit request =>
    Redirect("/conference/" + confId, MOVED_PERMANENTLY)
  }
}
