class @DoubleGisMap
  _id: null
  _map: null

  _centerChangeHandler: null
  _zoomChangeHandler: null

  _centerChangeObserver: null
  _zoomChangeObserver: null

  constructor: (id, lat, lon, zoom) ->
    @_id = id
    @_map = new DG.Map(id)
    @_map.setCenter(new DG.GeoPoint(lon, lat), zoom)
    @_map.controls.add(new DG.Controls.Zoom())

  setCenterChangeHandler: (fn) ->
    @_centerChangeHandler = fn
    @_activateCenterChangeHandler()

  setZoomChangeHandler: (fn) ->
    @_zoomChangeHandler = fn
    @_activateZoomChangeHandler()

  getCenter: ->
    center = @_map.getCenter()
    [center.lat, center.lon]

  getZoom: ->
    @_map.getZoom()

  setCenter: (lat, lon) ->
    [oldLat, oldLon] = @getCenter()
    if lat != oldLat || lon != oldLon
      d "2GIS center actually changed, moving map"
      @_deactivateCenterChangeHandler()
      @_map.setCenter(new DG.GeoPoint(lon, lat))
      @_activateCenterChangeHandler()

  setZoom: (zoom) ->
    if zoom != @getZoom()
      d "2GIS zoom actually changed, zooming map"
      @_deactivateZoomChangeHandler()
      @_map.setZoom(zoom)
      @_activateZoomChangeHandler()

  # private

  _activateCenterChangeHandler: ->
    @_centerChangeObserver ||= @_map.addEventListener(@_id, 'DgDragStop', @_onCenterChange)
    @_centerChangeObserver.enable()

  _deactivateCenterChangeHandler: ->
    @_centerChangeObserver.disable()

  _activateZoomChangeHandler: ->
    @_zoomChangeObserver ||= @_map.addEventListener(@_id, 'DgZoomChange', @_onZoomChange)
    @_zoomChangeObserver.enable()

  _deactivateZoomChangeHandler: ->
    @_zoomChangeObserver.disable()

  _onCenterChange: =>
    [lat, lon] = @getCenter()
    @_centerChangeHandler?(lat, lon)

  _onZoomChange: =>
    @_zoomChangeHandler?(@getZoom())
