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
      this._deactivateCenterChangeHandler();
      this._map.setView([lat, lon], this._map.getZoom(), {
        reset: true
      });
      return this._activateCenterChangeHandler();
    };

    OpenStreetMap.prototype.setZoom = function(zoom) {
      this._deactivateZoomChangeHandler();
      this._map.setZoom(zoom);
      return this._activateZoomChangeHandler();
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
