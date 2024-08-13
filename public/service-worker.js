self._cacheVersion = "v21";

self.resourcesToCache = [
    // Views
    "/conferences",
    "/contact",
    "/about",
    "/impressum",
    "/datenschutz",
    // Assets
    "/assets/manifest.json",
    "/assets/images/favicon.ico",
    "/assets/images/favicon.png",
    "/assets/images/bccn.png",
    "/assets/images/gnode_logo.png",
    "/assets/images/jnode_logo.png",
    "/assets/stylesheets/print.css",
    "/assets/stylesheets/style.css",
    // libs
    "/assets/javascripts/lib/accessors.js",
    "/assets/javascripts/lib/astate.js",
    "/assets/javascripts/lib/models.js",
    "/assets/javascripts/lib/msg.js",
    "/assets/javascripts/lib/multi.js",
    "/assets/javascripts/lib/offline.js",
    "/assets/javascripts/lib/owned.js",
    "/assets/javascripts/lib/tools.js",
    "/assets/javascripts/lib/update-storage.js",
    "/assets/javascripts/lib/validate.js",
    // View Models
    "/assets/javascripts/abstract-list.js",
    "/assets/javascripts/abstract-viewer.js",
    "/assets/javascripts/abstract-favourite.js",
    "/assets/javascripts/browser.js",
    "/assets/javascripts/conference-schedule.js",
    "/assets/javascripts/config.js",
    "/assets/javascripts/editor.js",
    "/assets/javascripts/locations.js",
    "/assets/javascripts/main.js",
    "/assets/javascripts/userdash.js",
    // WebJars
    "/assets/lib/bootstrap/js/bootstrap.bundle.min.js",
    "/assets/lib/bootstrap/css/bootstrap.min.css",
    "/assets/lib/datetimepicker/build/jquery.datetimepicker.full.min.js",
    "/assets/lib/datetimepicker/build/jquery.datetimepicker.min.css",
    "/assets/lib/dhtmlx-scheduler/codebase/dhtmlxscheduler.js",
    "/assets/lib/dhtmlx-scheduler/codebase/dhtmlxscheduler.css",
    "/assets/lib/dayjs/dayjs.min.js",
    "/assets/lib/dayjs/plugin/calendar.js",
    "/assets/lib/font-awesome/css/all.min.css",
    "/assets/lib/jquery/jquery.min.js",
    "/assets/lib/jquery-mousewheel/jquery.mousewheel.js",
    "/assets/lib/jquery-ui/jquery-ui.min.js",
    "/assets/lib/jquery-ui/jquery-ui.min.css",
    "/assets/lib/knockout/knockout.js",
    "/assets/lib/knockout-sortable/build/knockout-sortable.min.js",
    "/assets/lib/leaflet/dist/leaflet.js",
    "/assets/lib/leaflet/dist/leaflet.css",
    "/assets/lib/mathjax/es5/tex-mml-chtml.js",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_AMS-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Bold.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Bold.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Bold.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Italic.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-BoldItalic.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-Italic.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Bold.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Italic.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Script-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size1-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size2-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size3-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size4-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Typewriter-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Bold.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Regular.woff",
    "/assets/lib/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Zero.woff",
    "/assets/lib/requirejs/require.min.js",
    "/assets/lib/sammy/sammy.min.js",
    // Online Resources
    "https://fonts.googleapis.com/css?family=EB+Garamond|Open+Sans",
    // Style Sources
    "/assets/stylesheets/_bootstrap_custom.scss",
    "/assets/stylesheets/print.scss",
    "/assets/stylesheets/style.scss"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        self.loadDynamicViews().then(function (views) {
            if (views) {
                views.forEach(function (view) {
                    if (view) {
                        self.resourcesToCache.push(view);
                    }
                })
            }
            return caches.open(self._cacheVersion);
        }).then(function(cache) {
            var externalResources = [];
            var internalResources = [];
            self.resourcesToCache.forEach(function (resource) {
                if (resource.startsWith("https://") || resource.startsWith("http://")) {
                    externalResources.push(resource);
                } else {
                    internalResources.push(resource);
                }
            });
            // Cache internal resources.
            return Promise.all(
                internalResources.map(function (url) {
                    return fetch(url).then( function (response) {
                        return cache.put(new Request(url), response);
                    }).catch(function (reason) {
                        /*
                         * Print an error message, but do not stop execution as a resource
                         * can easily not be available.
                         */
                        console.log("The internal resource + " + url
                            + " could not be cached for reason: " + reason);
                        return Promise.resolve(false);
                    });
                })).then(function () {
                // Cache external resources.
                return Promise.all(
                    externalResources.map(function (url) {
                        return fetch(url, { mode: "no-cors" }).then( function (response) {
                            return cache.put(new Request(url, { mode: "no-cors" }), response);
                        }).catch(function (reason) {
                            /*
                             * Print an error message, but do not stop execution as a resource
                             * can easily not be available.
                             */
                            console.log("The external resource + " + url
                                + " could not be cached for reason: " + reason);
                            return Promise.resolve(false);
                        });
                    })
                ).catch(function (reason) {
                    console.log("The external resources could not be cached for reason: " + reason);
                    return Promise.reject(reason);
                });
            }).catch(function (reason) {
                 //Print an error message and stop execution.
                console.log("The resources + " + self.resourcesToCache
                    + " could not be cached for reason: " + reason);
                return Promise.reject(false);
            });
        }).catch(function (reason) {
            //Print an error message and stop execution.
            console.log("The initialisation of the service worker "
                + "did fail for reason: " + reason);
            return Promise.resolve(false);
        })
    );
});

// Get a promise containing the first served conference and abstract views.
self.loadDynamicViews = function () {
    return new Promise(function (resolve, reject) {
        var dynamicViews = [];
        var accordingAbstracts = [];
        fetch("/api/conferences").then(function (response) {
            return response.json();
        }).then(function (conferences) {
            var conf = conferences[0];
            if (conf) {
                dynamicViews.push("/conference/" + conf.short);
                dynamicViews.push("/conference/" + conf.short + "/schedule");
                dynamicViews.push("/conference/" + conf.short + "/submission");
                dynamicViews.push("/conference/" + conf.short + "/floorplans");
                dynamicViews.push("/conference/" + conf.short + "/locations");
                dynamicViews.push("/conference/" + conf.short + "/abstracts");
                dynamicViews.push(conf.logo);
                dynamicViews.push(conf.thumbnail);
                if (conf.banner) {
                    conf.banner.forEach(function (banner) {
                        if (banner) {
                            dynamicAbstracts.push("/api/banner/"+banner.uuid+"/imagemobile");
                        }
                    });
                }
                accordingAbstracts.push(self.loadDynamicAbstracts(conf.abstracts));
            };
            Promise.all(accordingAbstracts).then(function (allAbstracts) {
                allAbstracts.forEach(function (abstracts) {
                    if (abstracts) {
                        abstracts.forEach(function (abs) {
                            if (abs) {
                                dynamicViews.push(abs);
                            }
                        });
                    }
                });
                resolve(dynamicViews);
            });
        }).catch(function (reason) {
            console.log("Could not fetch /api/conferences for the following reason: "
                + reason);
            reject(reason);
        });
    });
};

// Get a promise containing all abstracts for the given URL.
self.loadDynamicAbstracts = function (abstractsURL) {
    return new Promise(function (resolve, reject) {
        var dynamicAbstracts = [];
        fetch(abstractsURL).then(function (response) {
            return response.json();
        }).then(function (abstracts) {
            if (abstracts) {
                abstracts.forEach(function (abs) {
                    if (abs) {
                        // Add the abstract URL.
                        dynamicAbstracts.push("/abstracts/" + abs.uuid);
                        // Add all the figure URLs.
                        if (abs.figures) {
                            abs.figures.forEach(function (figure) {
                                if (figure) {
                                    //dynamicAbstracts.push(figure.URL);
                                    dynamicAbstracts.push("/api/figures/"+figure.uuid+"/imagemobile");
                                }
                            });
                        }
                    }
                });
            }
            resolve(dynamicAbstracts);
        }).catch(function (reason) {
            console.log("Could not fetch " + abstractsURL + " for the following reason: "
            + reason);
            // This must resolve anyhow and not get rejected for the rest of the code to work.
            resolve(false);
        });
    });
};

// Helper function to clean redirected responses.
self.unredirect = function (response) {
    return response.text().then(function (text) {
        return new Response(text, {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText
        });
    });
};

// Check if a connection to the server can be established.
self.canConnectToServer = function () {
    return new Promise(function (resolve, reject) {
        fetch("/").then(function (response) {
            resolve(true);
        }).catch(function (reason) {
            resolve(false);
        });
    });
};

self.addEventListener("fetch", function(event) {
    event.respondWith(self.handleFetch(event.request));
});

// Handles all fetches and redirects them to the cache if offline.
self.handleFetch = function(initialRequest) {
  return self.canConnectToServer().then(function (connected) {
      // Normally load the stuff from the server and only fallback to cache if loading is not working.
      if (connected) {
          return fetch(initialRequest);
      } else {
          return caches.match(initialRequest).then(function (response) {
              var clonedResponse = response.clone();
              if (clonedResponse.redirected) {
                  return self.unredirect(clonedResponse);
              } else {
                  return clonedResponse;
              }
          }).catch(function (reason) { // The resource could not be loaded. Return a default one.
              console.log("Retrieval of " + JSON.stringify(initialRequest.url, null, 4) + " from cache " +
                  "failed because of: " + reason);
              return caches.match("/conferences");
          });
      }
  });
};