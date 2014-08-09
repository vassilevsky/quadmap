class @GoogleMaps
  _map: null

  _centerChangeHandler: null
  _zoomChangeHandler: null

  _centerChangeListener: null
  _zoomChangeListener: null

  constructor: (id, lat, lon, zoom) ->
    @_map = new google.maps.Map document.getElementById(id),
      center: new google.maps.LatLng(lat, lon)
      zoom: zoom

  setCenterChangeHandler: (fn) ->
    @_centerChangeHandler = fn
    @_activateCenterChangeListener()

  setZoomChangeHandler: (fn) ->
    @_zoomChangeHandler = fn
    @_activateZoomChangeListener()

  getCenter: ->
    center = @_map.getCenter()
    [center.lat(), center.lng()]

  getZoom: ->
    @_map.getZoom()

  setCenter: (lat, lon) ->
    [oldLat, oldLon] = @getCenter()
    if lat != oldLat || lon != oldLon
      d "Google center actually changed, moving map"
      @_deactivateCenterChangeListener()
      @_map.setCenter(new google.maps.LatLng(lat, lon))
      @_activateCenterChangeListener()

  setZoom: (zoom) ->
    if zoom != @getZoom()
      d "Google zoom actually changed, zooming map"
      @_deactivateZoomChangeListener()
      @_map.setZoom(zoom)
      @_activateZoomChangeListener()

  # private

  _activateCenterChangeListener: ->
    @_centerChangeListener = google.maps.event.addListener(@_map, 'dragend', @_onCenterChange)

  _deactivateCenterChangeListener: ->
    google.maps.event.removeListener(@_centerChangeListener)

  _activateZoomChangeListener: ->
    @_zoomChangeListener = google.maps.event.addListener(@_map, 'zoom_changed', @_onZoomChange)

  _deactivateZoomChangeListener: ->
    google.maps.event.removeListener(@_zoomChangeListener)

  _onCenterChange: =>
    [lat, lon] = @getCenter()
    @_centerChangeHandler?(lat, lon)

  _onZoomChange: =>
    @_zoomChangeHandler?(@getZoom())
