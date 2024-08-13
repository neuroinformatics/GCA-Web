require(['main'], function () {
  require(['lib/models', 'lib/tools', 'leaflet', 'lib/msg', 'lib/astate', 'knockout', 'lib/offline'], function (
    models,
    tools,
    msg,
    leaflet,
    astate,
    ko,
    offline,
  ) {
    'use strict';

    function LocationsViewModel(confId, mapType) {
      if (!(this instanceof LocationsViewModel)) {
        return new LocationsViewModel(confId, mapType);
      }

      var self = tools.inherit(this, msg.MessageBox);

      self.mapType = mapType;

      self.conference = ko.observable(null);
      self.geoContent = ko.observable(null);
      self.stateLog = ko.observable(null);

      // Observables as iterative list
      self.init = function () {
        self.loadConference(confId);
        ko.applyBindings(window.viewer);
        // start MathJax
        MathJax.typeset();
      };

      self.ioFailHandler = function (jqxhr, textStatus, error) {
        self.setError('Error', 'Unable to load the conference with uuid = ' + confId);
      };

      self.loadConference = function (confId) {
        // we should be reading this from the conference
        var confUrl = '/api/conferences/' + confId;

        offline.requestJSON(confId, confUrl, onConferenceData, self.ioFailHandler);

        function onConferenceData(confObj) {
          var conf = models.Conference.fromObject(confObj);
          self.conference(conf);
          offline.requestJSON(conf.uuid + 'geo', self.conference().geo, onGeoData, self.ioFailHandler);

          function onGeoData(geojson) {
            // depending on whether locations or floor plan page
            if (self.mapType === 'locations') {
              $('#map-div').height(0.75 * $('#map-div').width());
              var map = L.map('map-div');
              L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              }).addTo(map);
              let isFirst = true;
              function onEachFeature(feature, layer) {
                if (feature.properties != null) {
                  const { name, description } = feature.properties;
                  if (name != null) {
                    const text = `<b>${name}</b>${description != null ? `<br />${description}` : ''}`;
                    layer.bindPopup(text);
                  }
                }
                if (feature.geometry != null) {
                  const { type, coordinates } = feature.geometry;
                  if (isFirst && type != null && type === 'Point') {
                    map.setView([coordinates[1], coordinates[0]], 13);
                    isFirst = false;
                  }
                }
              }
              L.geoJSON(geojson, {
                onEachFeature: onEachFeature,
              }).addTo(map);
            } else if (self.mapType === 'floorplans') {
              const features = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
              // load all floorplans on one page
              for (let i = 0; i < features.length; i++) {
                // load floorplans, if they're included
                if (features[i].properties && features[i].properties.floorplans) {
                  const { name, description } = features[i].properties;
                  const floorplans = Array.isArray(features[i].properties.floorplans)
                    ? features[i].properties.floorplans
                    : [features[i].properties.floorplans];
                  $('#floorplans').append(`<h2>${name}</h2>${description != null ? `<p>${description}</p>` : ''}`);
                  for (let j = 0; j < floorplans.length; j++) {
                    // create image in order to get actual image dimensions cross browser
                    const img = new Image();
                    img.src = floorplans[j];
                    img.onload = function () {
                      handleLoad(img, i, j);
                    };
                    // possible to incorporate rooms with coordinates just as above,
                    // just be sure to use right coordinate system (cf. leaflet page)
                    // and mapping probably needed for room number vs. location
                  }
                }
              }
            }

            function handleLoad(img, i, j) {
              const key = `floorplan-${i}-${j}`;
              const id = `#${key}`;
              $('#floorplans').append(`<div id="${key}" class="floorplan" style="margin-bottom: 1em;"></div>`);

              // Get accurate measurements from that.
              const nw = img.width;
              const nh = img.height;

              const floor = L.map(key, {
                crs: L.CRS.Simple,
                minZoom: 0,
              });

              if (nh > nw) {
                $(id).height($(id).width());
                $(id).width((nw / nh) * $(id).height());
              } else {
                $(id).height((nh / nw) * $(id).width());
              }

              const bounds = [
                [0, 0],
                [$(id).height(), $(id).width()],
              ];
              console.log(bounds);
              L.imageOverlay(img.src, bounds).addTo(floor);
              floor.fitBounds(bounds);
            }
          }
        }
      };
    }

    $(document).ready(function () {
      var data = tools.hiddenData();
      window.viewer = LocationsViewModel(data['conferenceUuid'], data['mapType']);
      window.viewer.init();
    });
  });
});
