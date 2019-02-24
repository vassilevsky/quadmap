(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.DoubleGisMap = (function() {
    DoubleGisMap.prototype._id = null;

    DoubleGisMap.prototype._map = null;

    DoubleGisMap.prototype._centerChangeHandler = null;

    DoubleGisMap.prototype._zoomChangeHandler = null;

    DoubleGisMap.prototype._centerChangeObserver = null;

    DoubleGisMap.prototype._zoomChangeObserver = null;

    function DoubleGisMap(id, lat, lon, zoom) {
      this._onZoomChange = __bind(this._onZoomChange, this);
      this._onCenterChange = __bind(this._onCenterChange, this);
      this._id = id;
      this._map = new DG.Map(id);
      this._map.setCenter(new DG.GeoPoint(lon, lat), zoom);
      this._map.controls.add(new DG.Controls.Zoom());
    }

    DoubleGisMap.prototype.setCenterChangeHandler = function(fn) {
      this._centerChangeHandler = fn;
      return this._activateCenterChangeHandler();
    };

    DoubleGisMap.prototype.setZoomChangeHandler = function(fn) {
      this._zoomChangeHandler = fn;
      return this._activateZoomChangeHandler();
    };

    DoubleGisMap.prototype.getCenter = function() {
      var center;
      center = this._map.getCenter();
      return [center.lat, center.lon];
    };

    DoubleGisMap.prototype.getZoom = function() {
      return this._map.getZoom();
    };

    DoubleGisMap.prototype.setCenter = function(lat, lon) {
      var oldLat, oldLon, _ref;
      _ref = this.getCenter(), oldLat = _ref[0], oldLon = _ref[1];
      if (lat !== oldLat || lon !== oldLon) {
        d("2GIS center actually changed, moving map");
        this._deactivateCenterChangeHandler();
        this._map.setCenter(new DG.GeoPoint(lon, lat));
        return this._activateCenterChangeHandler();
      }
    };

    DoubleGisMap.prototype.setZoom = function(zoom) {
      if (zoom !== this.getZoom()) {
        d("2GIS zoom actually changed, zooming map");
        this._deactivateZoomChangeHandler();
        this._map.setZoom(zoom);
        return this._activateZoomChangeHandler();
      }
    };

    DoubleGisMap.prototype._activateCenterChangeHandler = function() {
      this._centerChangeObserver || (this._centerChangeObserver = this._map.addEventListener(this._id, 'DgDragStop', this._onCenterChange));
      return this._centerChangeObserver.enable();
    };

    DoubleGisMap.prototype._deactivateCenterChangeHandler = function() {
      return this._centerChangeObserver.disable();
    };

    DoubleGisMap.prototype._activateZoomChangeHandler = function() {
      this._zoomChangeObserver || (this._zoomChangeObserver = this._map.addEventListener(this._id, 'DgZoomChange', this._onZoomChange));
      return this._zoomChangeObserver.enable();
    };

    DoubleGisMap.prototype._deactivateZoomChangeHandler = function() {
      return this._zoomChangeObserver.disable();
    };

    DoubleGisMap.prototype._onCenterChange = function() {
      var lat, lon, _ref;
      _ref = this.getCenter(), lat = _ref[0], lon = _ref[1];
      return typeof this._centerChangeHandler === "function" ? this._centerChangeHandler(lat, lon) : void 0;
    };

    DoubleGisMap.prototype._onZoomChange = function() {
      return typeof this._zoomChangeHandler === "function" ? this._zoomChangeHandler(this.getZoom()) : void 0;
    };

    return DoubleGisMap;

  })();

}).call(this);
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
      return this._activateCenterChangeListener();
    };

    GoogleMaps.prototype.setZoomChangeHandler = function(fn) {
      this._zoomChangeHandler = fn;
      return this._activateZoomChangeListener();
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
      var oldLat, oldLon, _ref;
      _ref = this.getCenter(), oldLat = _ref[0], oldLon = _ref[1];
      if (lat !== oldLat || lon !== oldLon) {
        d("Google center actually changed, moving map");
        this._deactivateCenterChangeListener();
        this._map.setCenter(new google.maps.LatLng(lat, lon));
        return this._activateCenterChangeListener();
      }
    };

    GoogleMaps.prototype.setZoom = function(zoom) {
      if (zoom !== this.getZoom()) {
        d("Google zoom actually changed, zooming map");
        this._deactivateZoomChangeListener();
        this._map.setZoom(zoom);
        return this._activateZoomChangeListener();
      }
    };

    GoogleMaps.prototype._activateCenterChangeListener = function() {
      return this._centerChangeListener = google.maps.event.addListener(this._map, 'dragend', this._onCenterChange);
    };

    GoogleMaps.prototype._deactivateCenterChangeListener = function() {
      return google.maps.event.removeListener(this._centerChangeListener);
    };

    GoogleMaps.prototype._activateZoomChangeListener = function() {
      return this._zoomChangeListener = google.maps.event.addListener(this._map, 'zoom_changed', this._onZoomChange);
    };

    GoogleMaps.prototype._deactivateZoomChangeListener = function() {
      return google.maps.event.removeListener(this._zoomChangeListener);
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
      return this._activateCenterChangeHandler();
    };

    OpenStreetMap.prototype.setZoomChangeHandler = function(fn) {
      this._zoomChangeHandler = fn;
      return this._activateZoomChangeHandler();
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
      var oldLat, oldLon, _ref;
      _ref = this.getCenter(), oldLat = _ref[0], oldLon = _ref[1];
      if (lat !== oldLat || lon !== oldLon) {
        d("OSM center actually changed, moving map");
        this._deactivateCenterChangeHandler();
        this._map.setView([lat, lon], this._map.getZoom(), {
          reset: true
        });
        return this._activateCenterChangeHandler();
      }
    };

    OpenStreetMap.prototype.setZoom = function(zoom) {
      if (zoom !== this.getZoom()) {
        d("OSM zoom actually changed, zooming map");
        this._deactivateZoomChangeHandler();
        this._map.setZoom(zoom);
        return this._activateZoomChangeHandler();
      }
    };

    OpenStreetMap.prototype._activateCenterChangeHandler = function() {
      return this._map.on('dragend', this._onCenterChange);
    };

    OpenStreetMap.prototype._deactivateCenterChangeHandler = function() {
      return this._map.off('dragend', this._onCenterChange);
    };

    OpenStreetMap.prototype._activateZoomChangeHandler = function() {
      return this._map.on('zoomend', this._onZoomChange);
    };

    OpenStreetMap.prototype._deactivateZoomChangeHandler = function() {
      return this._map.off('zoomend', this._onZoomChange);
    };

    OpenStreetMap.prototype._onCenterChange = function() {
      var lat, lon, _ref;
      _ref = this.getCenter(), lat = _ref[0], lon = _ref[1];
      return typeof this._centerChangeHandler === "function" ? this._centerChangeHandler(lat, lon) : void 0;
    };

    OpenStreetMap.prototype._onZoomChange = function() {
      return typeof this._zoomChangeHandler === "function" ? this._zoomChangeHandler(this.getZoom()) : void 0;
    };

    return OpenStreetMap;

  })();

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.YandexMaps = (function() {
    YandexMaps.prototype._map = null;

    YandexMaps.prototype._centerChangeHandler = null;

    YandexMaps.prototype._zoomChangeHandler = null;

    YandexMaps.prototype._isBoundsChangeHandlerSet = false;

    function YandexMaps(id, lat, lon, zoom) {
      this._onBoundsChange = __bind(this._onBoundsChange, this);
      this._map = new ymaps.Map('map3', {
        center: [lat, lon],
        zoom: zoom
      });
      this._map.controls.add(new ymaps.control.SmallZoomControl());
    }

    YandexMaps.prototype.setCenterChangeHandler = function(fn) {
      this._centerChangeHandler = fn;
      return this._activateBoundsChangeHandler();
    };

    YandexMaps.prototype.setZoomChangeHandler = function(fn) {
      this._zoomChangeHandler = fn;
      return this._activateBoundsChangeHandler();
    };

    YandexMaps.prototype.getCenter = function() {
      return this._map.getCenter();
    };

    YandexMaps.prototype.getZoom = function() {
      return this._map.getZoom();
    };

    YandexMaps.prototype.setCenter = function(lat, lon) {
      var oldLat, oldLon, _ref;
      _ref = this.getCenter(), oldLat = _ref[0], oldLon = _ref[1];
      if (lat !== oldLat || lon !== oldLon) {
        d("Yandex center actually changed, moving map");
        this._deactivateBoundsChangeHandler();
        this._map.setCenter([lat, lon]);
        return this._activateBoundsChangeHandler();
      }
    };

    YandexMaps.prototype.setZoom = function(zoom) {
      if (zoom !== this.getZoom()) {
        d("Yandex zoom actually changed, zooming map");
        this._deactivateBoundsChangeHandler();
        this._map.setZoom(zoom);
        return this._activateBoundsChangeHandler();
      }
    };

    YandexMaps.prototype._activateBoundsChangeHandler = function() {
      if (!this._isBoundsChangeHandlerSet) {
        this._map.events.add('boundschange', this._onBoundsChange);
        return this._isBoundsChangeHandlerSet = true;
      }
    };

    YandexMaps.prototype._deactivateBoundsChangeHandler = function() {
      if (this._isBoundsChangeHandlerSet) {
        this._map.events.remove('boundschange', this._onBoundsChange);
        return this._isBoundsChangeHandlerSet = false;
      }
    };

    YandexMaps.prototype._onBoundsChange = function(event) {
      var newLat, newLon, newZoom, oldLat, oldLon, _ref, _ref1;
      _ref = event.get('oldCenter'), oldLat = _ref[0], oldLon = _ref[1];
      _ref1 = event.get('newCenter'), newLat = _ref1[0], newLon = _ref1[1];
      if (newLat !== oldLat || newLon !== oldLon) {
        if (typeof this._centerChangeHandler === "function") {
          this._centerChangeHandler(newLat, newLon);
        }
      }
      newZoom = event.get('newZoom');
      if (newZoom !== event.get('oldZoom')) {
        return typeof this._zoomChangeHandler === "function" ? this._zoomChangeHandler(newZoom) : void 0;
      }
    };

    return YandexMaps;

  })();

}).call(this);
(function() {
  var maps, position2uri, setCenter, setLocationFromDevice, setLocationFromUri, setLocationToRussia, setZoom;

  this.d = function() {
    return console.debug(arguments);
  };

  setLocationFromUri = function() {
    var lat, lon, zoom, _ref;
    _ref = location.hash.replace('#map=', '').split('/'), zoom = _ref[0], lat = _ref[1], lon = _ref[2];
    zoom = parseInt(zoom);
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    d("received zoom " + zoom + " and coordinates " + lat + ", " + lon + " from URL");
    setCenter(lat, lon);
    return setZoom(zoom);
  };

  setLocationToRussia = function() {
    d('setting location to include Russia');
    setCenter(66, 99);
    return setZoom(2);
  };

  setLocationFromDevice = function(position) {
    var lat, lon;
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    d("received coordinates " + lat + ", " + lon + " from URL");
    setCenter(lat, lon);
    return setZoom(14);
  };

  position2uri = function() {
    return window.location = "#map=" + this.zoom + "/" + this.lat + "/" + this.lon;
  };

  setCenter = function(lat, lon, source_map_name) {
    var map, name, _ref;
    d("" + source_map_name + " moved to " + lat + ", " + lon + ". Moving other maps...");
    for (name in maps) {
      map = maps[name];
      if (name !== source_map_name) {
        map.setCenter(lat, lon);
      }
    }
    _ref = [lat, lon], this.lat = _ref[0], this.lon = _ref[1];
    return position2uri();
  };

  setZoom = function(zoom, source_map_name) {
    var map, name;
    d("" + source_map_name + " zoomed to " + zoom + ". Zooming other maps...");
    for (name in maps) {
      map = maps[name];
      if (name !== source_map_name) {
        map.setZoom(zoom);
      }
    }
    this.zoom = zoom;
    return position2uri();
  };

  window.onpopstate = setLocationFromUri;

  if (location.hash.length > 1) {
    setLocationFromUri();
  } else {
    setLocationToRussia();
    navigator.geolocation.getCurrentPosition(setLocationFromDevice);
  }

  maps = {};

  window.onload = function() {
    maps.osm = new OpenStreetMap('map1', this.lat, this.lon, this.zoom);
    maps.osm.setCenterChangeHandler((function(_this) {
      return function(lat, lon) {
        return setCenter(lat, lon, 'osm');
      };
    })(this));
    return maps.osm.setZoomChangeHandler((function(_this) {
      return function(zoom) {
        return setZoom(zoom, 'osm');
      };
    })(this));
  };

  google.maps.event.addDomListener(window, 'load', function() {
    maps.google = new GoogleMaps('map2', this.lat, this.lon, this.zoom);
    maps.google.setCenterChangeHandler((function(_this) {
      return function(lat, lon) {
        return setCenter(lat, lon, 'google');
      };
    })(this));
    return maps.google.setZoomChangeHandler((function(_this) {
      return function(zoom) {
        return setZoom(zoom, 'google');
      };
    })(this));
  });

  ymaps.ready(function() {
    maps.yandex = new YandexMaps('map3', this.lat, this.lon, this.zoom);
    maps.yandex.setCenterChangeHandler((function(_this) {
      return function(lat, lon) {
        return setCenter(lat, lon, 'yandex');
      };
    })(this));
    return maps.yandex.setZoomChangeHandler((function(_this) {
      return function(zoom) {
        return setZoom(zoom, 'yandex');
      };
    })(this));
  });

  DG.autoload(function() {
    maps.dgis = new DoubleGisMap('map4', this.lat, this.lon, this.zoom);
    maps.dgis.setCenterChangeHandler(function(lat, lon) {
      return setCenter(lat, lon, 'dgis');
    });
    return maps.dgis.setZoomChangeHandler(function(zoom) {
      return setZoom(zoom, 'dgis');
    });
  });

  this.maps = maps;

}).call(this);


