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
    @_centerChangeListener = google.maps.event.addListener(@_map, 'dragend', @_onCenterChange)

  setZoomChangeHandler: (fn) ->
    @_zoomChangeHandler = fn
    @_zoomChangeListener = google.maps.event.addListener(@_map, 'zoom_changed', @_onZoomChange)

  getCenter: ->
    center = @_map.getCenter()
    [center.lat(), center.lng()]

  getZoom: ->
    @_map.getZoom()

  setCenter: (lat, lon) ->
    google.maps.event.removeListener(@_centerChangeListener)
    @_map.setCenter(new google.maps.LatLng(lat, lon))
    @_centerChangeListener = google.maps.event.addListener(@_map, 'dragend', @_onCenterChange)

  setZoom: (zoom) ->
    google.maps.event.removeListener(@_zoomChangeListener)
    @_map.setZoom(zoom)
    @_zoomChangeListener = google.maps.event.addListener(@_map, 'zoom_changed', @_onZoomChange)

  _onCenterChange: =>
    [lat, lon] = @getCenter()
    @_centerChangeHandler?(lat, lon)

  _onZoomChange: =>
    @_zoomChangeHandler?(@getZoom())
