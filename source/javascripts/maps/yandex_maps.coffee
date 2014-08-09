class @YandexMaps
  _map: null

  _centerChangeHandler: null
  _zoomChangeHandler: null

  _isBoundsChangeHandlerSet: false

  constructor: (id, lat, lon, zoom) ->
    @_map = new ymaps.Map('map3', center: [lat, lon], zoom: zoom)

  setCenterChangeHandler: (fn) ->
    @_centerChangeHandler = fn
    @_activateBoundsChangeHandler()

  setZoomChangeHandler: (fn) ->
    @_zoomChangeHandler = fn
    @_activateBoundsChangeHandler()

  getCenter: ->
    @_map.getCenter()

  getZoom: ->
    @_map.getZoom()

  setCenter: (lat, lon) ->
    [oldLat, oldLon] = @getCenter()
    if lat != oldLat || lon != oldLon
      d "Yandex center actually changed, moving map"
      @_deactivateBoundsChangeHandler()
      @_map.setCenter([lat, lon])
      @_activateBoundsChangeHandler()

  setZoom: (zoom) ->
    if zoom != @getZoom()
      d "Yandex zoom actually changed, zooming map"
      @_deactivateBoundsChangeHandler()
      @_map.setZoom(zoom)
      @_activateBoundsChangeHandler()

  # private

  _activateBoundsChangeHandler: ->
    unless @_isBoundsChangeHandlerSet
      @_map.events.add('boundschange', @_onBoundsChange)
      @_isBoundsChangeHandlerSet = true

  _deactivateBoundsChangeHandler: ->
    if @_isBoundsChangeHandlerSet
      @_map.events.remove('boundschange', @_onBoundsChange)
      @_isBoundsChangeHandlerSet = false

  _onBoundsChange: (event) =>
    [oldLat, oldLon] = event.get('oldCenter')
    [newLat, newLon] = event.get('newCenter')
    if newLat != oldLat || newLon != oldLon
      @_centerChangeHandler?(newLat, newLon)

    newZoom = event.get('newZoom')
    if newZoom != event.get('oldZoom')
      @_zoomChangeHandler?(newZoom)
