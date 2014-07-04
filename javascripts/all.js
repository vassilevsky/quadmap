(function() {
  var d, dgis_zoom_observer, google_zoom_listener, lat, lon, maps, osm_zoom_handler, setCenter, setZoom, yandex_change_handler, zoom, _ref, _ref1;

  d = function() {
    return console.debug(arguments);
  };

  if (window.location.hash.length > 1) {
    _ref = window.location.hash.replace('#', '').split('/'), zoom = _ref[0], lat = _ref[1], lon = _ref[2];
    zoom = parseInt(zoom);
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    d("received initial zoom " + zoom + " and coordinates " + lat + ", " + lon + " from URL");
  } else {
    _ref1 = [14, 54.32, 48.4], zoom = _ref1[0], lat = _ref1[1], lon = _ref1[2];
  }

  maps = {};

  google_zoom_listener = null;

  setCenter = function(lat, lon, source_map_name) {
    d('=====');
    d("HAVE TO MOVE OTHER MAPS BECAUSE " + source_map_name + " HAS MOVED");
    if (source_map_name !== 'osm') {
      d("set osm center to " + lat + ", " + lon);
      maps.osm.setView([lat, lon], maps.osm.getZoom(), {
        reset: true
      });
    }
    if (source_map_name !== 'google') {
      d("set google center to " + lat + ", " + lon);
      maps.google.setCenter(new google.maps.LatLng(lat, lon));
    }
    if (source_map_name !== 'yandex') {
      d("set yandex center to " + lat + ", " + lon);
      maps.yandex.events.remove('boundschange', yandex_change_handler);
      maps.yandex.setCenter([lat, lon]);
      maps.yandex.events.add('boundschange', yandex_change_handler);
    }
    if (source_map_name !== 'dgis') {
      d("set dgis center to " + lat + ", " + lon);
      dgis_zoom_observer.disable();
      maps.dgis.setCenter(new DG.GeoPoint(lon, lat));
      dgis_zoom_observer.enable();
    }
  };

  setZoom = function(source_map_name) {
    var new_zoom;
    d('=====');
    d("HAVE TO ZOOM OTHER MAPS BECAUSE " + source_map_name + " HAS CHANGED ZOOM");
    new_zoom = maps[source_map_name].getZoom();
    if (source_map_name !== 'osm') {
      if (maps.osm.getZoom() !== new_zoom) {
        d("set osm zoom to " + new_zoom);
        maps.osm.setZoom(new_zoom);
      }
    }
    if (source_map_name !== 'google') {
      if (maps.google.getZoom() !== new_zoom) {
        d("set google zoom to " + new_zoom);
        google.maps.event.removeListener(google_zoom_listener);
        maps.google.setZoom(new_zoom);
        google_zoom_listener = google.maps.event.addListener(maps.google, 'zoom_changed', function() {
          return setZoom('google');
        });
      }
    }
    if (source_map_name !== 'yandex') {
      if (maps.yandex.getZoom() !== new_zoom) {
        d("set yandex zoom to " + new_zoom);
        maps.yandex.events.remove('boundschange', yandex_change_handler);
        maps.yandex.setZoom(new_zoom);
        maps.yandex.events.add('boundschange', yandex_change_handler);
      }
    }
    if (source_map_name !== 'dgis') {
      if (maps.dgis.getZoom() !== new_zoom) {
        d("set dgis zoom to " + new_zoom);
        dgis_zoom_observer.disable();
        maps.dgis.setZoom(new_zoom);
        dgis_zoom_observer.enable();
      }
    }
  };

  window.onload = function() {
    maps.osm = new L.Map('map1');
    maps.osm.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }));
    maps.osm.setView([lat, lon], zoom);
    maps.osm.on('dragend', function() {
      var new_center;
      new_center = maps.osm.getCenter();
      return setCenter(new_center.lat, new_center.lng, 'osm');
    });
    return maps.osm.on('zoomend', function() {
      return setZoom('osm');
    });
  };

  google.maps.event.addDomListener(window, 'load', function() {
    maps.google = new google.maps.Map(document.getElementById('map2'), {
      center: new google.maps.LatLng(lat, lon),
      zoom: zoom
    });
    google.maps.event.addListener(maps.google, 'dragend', function() {
      var new_center;
      new_center = maps.google.getCenter();
      return setCenter(new_center.lat(), new_center.lng(), 'google');
    });
    return google_zoom_listener = google.maps.event.addListener(maps.google, 'zoom_changed', function() {
      return setZoom('google');
    });
  });

  yandex_change_handler = function(event) {
    var new_center;
    new_center = event.get('newCenter');
    if (new_center !== event.get('oldCenter')) {
      setCenter(new_center[0], new_center[1], 'yandex');
    }
    if (event.get('newZoom') !== event.get('oldZoom')) {
      return setZoom('yandex');
    }
  };

  ymaps.ready(function() {
    maps.yandex = new ymaps.Map('map3', {
      center: [lat, lon],
      zoom: zoom
    });
    return maps.yandex.events.add('boundschange', yandex_change_handler);
  });

  dgis_zoom_observer = null;

  DG.autoload(function() {
    maps.dgis = new DG.Map('map4');
    maps.dgis.setCenter(new DG.GeoPoint(lon, lat), zoom);
    maps.dgis.addEventListener('map4', 'DgDragStop', function() {
      var new_center;
      new_center = maps.dgis.getCenter();
      return setCenter(new_center.lat, new_center.lon, 'dgis');
    });
    return dgis_zoom_observer = maps.dgis.addEventListener('map4', 'DgZoomChange', function() {
      return setZoom('dgis');
    });
  });

}).call(this);
