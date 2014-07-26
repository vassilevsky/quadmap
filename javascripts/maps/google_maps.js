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
      this._deactivateCenterChangeListener();
      this._map.setCenter(new google.maps.LatLng(lat, lon));
      return this._activateCenterChangeListener();
    };

    GoogleMaps.prototype.setZoom = function(zoom) {
      this._deactivateZoomChangeListener();
      this._map.setZoom(zoom);
      return this._activateZoomChangeListener();
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
