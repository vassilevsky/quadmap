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
      this._deactivateCenterChangeHandler();
      this._map.setCenter(new DG.GeoPoint(lon, lat));
      return this._activateCenterChangeHandler();
    };

    DoubleGisMap.prototype.setZoom = function(zoom) {
      this._deactivateZoomChangeHandler();
      this._map.setZoom(zoom);
      return this._activateZoomChangeHandler();
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
