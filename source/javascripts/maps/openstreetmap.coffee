class @OpenStreetMap
  _map: null

  _centerChangeHandler: null
  _zoomChangeHandler: null

  constructor: (id, lat, lon, zoom) ->
    @_map = new L.Map(id)
    @_map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© Участники OpenStreetMap'))
    @_map.setView([lat, lon], zoom)

  setCenterChangeHandler: (fn) ->
    @_centerChangeHandler = fn
    @_activateCenterChangeHandler()

  setZoomChangeHandler: (fn) ->
    @_zoomChangeHandler = fn
    @_activateZoomChangeHandler()

  getCenter: ->
    center = @_map.getCenter()
    [center.lat, center.lng]

  getZoom: ->
    @_map.getZoom()

  setCenter: (lat, lon) ->
    @_deactivateCenterChangeHandler()
    @_map.setView([lat, lon], @_map.getZoom(), reset: true)
    @_activateCenterChangeHandler()

  setZoom: (zoom) ->
    @_deactivateZoomChangeHandler()
    @_map.setZoom(zoom)
    @_activateZoomChangeHandler()

  # private

  _activateCenterChangeHandler: ->
    @_map.on('dragend', @_onCenterChange)

  _deactivateCenterChangeHandler: ->
    @_map.off('dragend', @_onCenterChange)

  _activateZoomChangeHandler: ->
    @_map.on('zoomend', @_onZoomChange)

  _deactivateZoomChangeHandler: ->
    @_map.off('zoomend', @_onZoomChange)

  _onCenterChange: =>
    [lat, lon] = @getCenter()
    @_centerChangeHandler?(lat, lon)

  _onZoomChange: =>
    @_zoomChangeHandler?(@getZoom())
