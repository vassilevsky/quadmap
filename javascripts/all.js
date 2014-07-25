(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.GoogleMaps = (function() {
    GoogleMaps.prototype._map = null;

    GoogleMaps.prototype._centerChangeHandler = null;

    GoogleMaps.prototype._zoomChangeHandler = null;

    GoogleMaps.prototype._centerChangeListener = null;

    GoogleMaps.prototype._zoomChangeListener = null;

    function GoogleMaps(id, lat, lon, zoom) {
      this._onZoomChange = __bind(this._onZoomChange, this);
      this._onCenterChange = __bind(this._onCenterChange, this);
      this._map = new google.maps.Map(document.getElementById(id), {
        center: new google.maps.LatLng(lat, lon),
        zoom: zoom
      });
    }

    GoogleMaps.prototype.setCenterChangeHandler = function(fn) {
      this._centerChangeHandler = fn;
      return this._centerChangeListener = google.maps.event.addListener(this._map, 'dragend', this._onCenterChange);
    };

    GoogleMaps.prototype.setZoomChangeHandler = function(fn) {
      this._zoomChangeHandler = fn;
      return this._zoomChangeListener = google.maps.event.addListener(this._map, 'zoom_changed', this._onZoomChange);
    };

    GoogleMaps.prototype.getCenter = function() {
      var center;
      center = this._map.getCenter();
      return [center.lat(), center.lng()];
    };

    GoogleMaps.prototype.getZoom = function() {
      return this._map.getZoom();
    };

    GoogleMaps.prototype.setCenter = function(lat, lon) {
      google.maps.event.removeListener(this._centerChangeListener);
      this._map.setCenter(new google.maps.LatLng(lat, lon));
      return this._centerChangeListener = google.maps.event.addListener(this._map, 'dragend', this._onCenterChange);
    };

    GoogleMaps.prototype.setZoom = function(zoom) {
      google.maps.event.removeListener(this._zoomChangeListener);
      this._map.setZoom(zoom);
      return this._zoomChangeListener = google.maps.event.addListener(this._map, 'zoom_changed', this._onZoomChange);
    };

    GoogleMaps.prototype._onCenterChange = function() {
      var lat, lon, _ref;
      _ref = this.getCenter(), lat = _ref[0], lon = _ref[1];
      return typeof this._centerChangeHandler === "function" ? this._centerChangeHandler(lat, lon) : void 0;
    };

    GoogleMaps.prototype._onZoomChange = function() {
      return typeof this._zoomChangeHandler === "function" ? this._zoomChangeHandler(this.getZoom()) : void 0;
    };

    return GoogleMaps;

  })();

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.OpenStreetMap = (function() {
    OpenStreetMap.prototype._map = null;

    OpenStreetMap.prototype._centerChangeHandler = null;

    OpenStreetMap.prototype._zoomChangeHandler = null;

    function OpenStreetMap(id, lat, lon, zoom) {
      this._onZoomChange = __bind(this._onZoomChange, this);
      this._onCenterChange = __bind(this._onCenterChange, this);
      this._map = new L.Map(id);
      this._map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Участники OpenStreetMap'
      }));
      this._map.setView([lat, lon], zoom);
    }

    OpenStreetMap.prototype.setCenterChangeHandler = function(fn) {
      this._centerChangeHandler = fn;
      return this._map.on('dragend', this._onCenterChange);
    };

    OpenStreetMap.prototype.setZoomChangeHandler = function(fn) {
      this._zoomChangeHandler = fn;
      return this._map.on('zoomend', this._onZoomChange);
    };

    OpenStreetMap.prototype.getCenter = function() {
      var center;
      center = this._map.getCenter();
      return [center.lat, center.lng];
    };

    OpenStreetMap.prototype.getZoom = function() {
      return this._map.getZoom();
    };

    OpenStreetMap.prototype.setCenter = function(lat, lon) {
      this._map.off('dragend', this._onCenterChange);
      this._map.setView([lat, lon], this._map.getZoom(), {
        reset: true
      });
      return this._map.on('dragend', this._onCenterChange);
    };

    OpenStreetMap.prototype.setZoom = function(zoom) {
      this._map.off('zoomend', this._onZoomChange);
      this._map.setZoom(zoom);
      return this._map.on('zoomend', this._onZoomChange);
    };

    OpenStreetMap.prototype._onCenterChange = function() {
      var center;
      center = this._map.getCenter();
      return typeof this._centerChangeHandler === "function" ? this._centerChangeHandler(center.lat, center.lng) : void 0;
    };

    OpenStreetMap.prototype._onZoomChange = function() {
      return typeof this._zoomChangeHandler === "function" ? this._zoomChangeHandler(this._map.getZoom()) : void 0;
    };

    return OpenStreetMap;

  })();

}).call(this);
(function() {
  var d, dgis_zoom_observer, lat, lon, maps, setCenter, setZoom, yandex_change_handler, zoom, _ref, _ref1;

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

  setCenter = function(lat, lon, source_map_name) {
    d('=====');
    d("HAVE TO MOVE OTHER MAPS BECAUSE " + source_map_name + " HAS MOVED");
    if (source_map_name !== 'osm') {
      d("set osm center to " + lat + ", " + lon);
      maps.osm.setCenter(lat, lon);
    }
    if (source_map_name !== 'google') {
      d("set google center to " + lat + ", " + lon);
      maps.google.setCenter(lat, lon);
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
        maps.google.setZoom(new_zoom);
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
    maps.osm = new OpenStreetMap('map1', lat, lon, zoom);
    maps.osm.setCenterChangeHandler((function(_this) {
      return function(lat, lon) {
        return setCenter(lat, lon, 'osm');
      };
    })(this));
    return maps.osm.setZoomChangeHandler((function(_this) {
      return function(zoom) {
        return setZoom('osm');
      };
    })(this));
  };

  google.maps.event.addDomListener(window, 'load', function() {
    maps.google = new GoogleMaps('map2', lat, lon, zoom);
    maps.google.setCenterChangeHandler((function(_this) {
      return function(lat, lon) {
        return setCenter(lat, lon, 'google');
      };
    })(this));
    return maps.google.setZoomChangeHandler((function(_this) {
      return function(zoom) {
        return setZoom('google');
      };
    })(this));
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
