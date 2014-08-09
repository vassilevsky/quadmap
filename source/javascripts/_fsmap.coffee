@d = -> console.debug arguments

if window.location.hash.length > 1
  [zoom, lat, lon] = window.location.hash.replace('#', '').split('/')

  @zoom = parseInt(zoom)
  @lat = parseFloat(lat)
  @lon = parseFloat(lon)

  d "received initial zoom #{@zoom} and coordinates #{@lat}, #{@lon} from URL"
else
  [@zoom, @lat, @lon] = [14, 54.32, 48.4]
  updateURI()

maps = {}

updateURI = ->
  uri = "http://#{location.host}/##{@zoom}/#{@lat}/#{@lon}"
  history.pushState(null, null, uri)

setCenter = (lat, lon, source_map_name) ->
  d "Center of #{source_map_name} map moved to #{lat}, #{lon}. Moving other maps..."
  map.setCenter(lat, lon) for name, map of maps when name != source_map_name
  [@lat, @lon] = [lat, lon]
  updateURI()

setZoom = (zoom, source_map_name) ->
  d "Zoom of #{source_map_name} map changed to #{zoom}. Zooming other maps..."
  map.setZoom(zoom) for name, map of maps when name != source_map_name
  @zoom = zoom
  updateURI()

window.onload = ->
  maps.osm = new OpenStreetMap('map1', @lat, @lon, @zoom)

  maps.osm.setCenterChangeHandler (lat, lon) =>
    setCenter(lat, lon, 'osm')

  maps.osm.setZoomChangeHandler (zoom) =>
    setZoom(zoom, 'osm')


google.maps.event.addDomListener window, 'load', ->
  maps.google = new GoogleMaps('map2', @lat, @lon, @zoom)

  maps.google.setCenterChangeHandler (lat, lon) =>
    setCenter(lat, lon, 'google')

  maps.google.setZoomChangeHandler (zoom) =>
    setZoom(zoom, 'google')


ymaps.ready ->
  maps.yandex = new YandexMaps('map3', @lat, @lon, @zoom)

  maps.yandex.setCenterChangeHandler (lat, lon) =>
    setCenter(lat, lon, 'yandex')

  maps.yandex.setZoomChangeHandler (zoom) =>
    setZoom(zoom, 'yandex')


DG.autoload ->
  maps.dgis = new DoubleGisMap('map4', @lat, @lon, @zoom)

  maps.dgis.setCenterChangeHandler (lat, lon) ->
    setCenter(lat, lon, 'dgis')

  maps.dgis.setZoomChangeHandler (zoom) ->
    setZoom(zoom, 'dgis')

@maps = maps
