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
    @_map.on('dragend', @_onCenterChange)

  setZoomChangeHandler: (fn) ->
    @_zoomChangeHandler = fn
    @_map.on('zoomend', @_onZoomChange)

  getCenter: ->
    center = @_map.getCenter()
    [center.lat, center.lng]

  getZoom: ->
    @_map.getZoom()

  setCenter: (lat, lon) ->
    @_map.off('dragend', @_onCenterChange)
    @_map.setView([lat, lon], @_map.getZoom(), reset: true)
    @_map.on('dragend', @_onCenterChange)

  setZoom: (zoom) ->
    @_map.off('zoomend', @_onZoomChange)
    @_map.setZoom(zoom)
    @_map.on('zoomend', @_onZoomChange)

  _onCenterChange: =>
    center = @_map.getCenter()
    @_centerChangeHandler?(center.lat, center.lng)

  _onZoomChange: =>
    @_zoomChangeHandler?(@_map.getZoom())
