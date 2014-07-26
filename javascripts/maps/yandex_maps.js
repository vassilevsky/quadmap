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
      this._deactivateBoundsChangeHandler();
      this._map.setCenter([lat, lon]);
      return this._activateBoundsChangeHandler();
    };

    YandexMaps.prototype.setZoom = function(zoom) {
      this._deactivateBoundsChangeHandler();
      this._map.setZoom(zoom);
      return this._activateBoundsChangeHandler();
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
