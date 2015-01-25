@d = -> console.debug arguments

setLocationFromUri = ->
  [zoom, lat, lon] = location.hash.replace('#map=', '').split('/')

  zoom = parseInt(zoom)
  lat = parseFloat(lat)
  lon = parseFloat(lon)

  d "received zoom #{zoom} and coordinates #{lat}, #{lon} from URL"

  setCenter(lat, lon)
  setZoom(zoom)

setLocationToRussia = ->
  d 'setting location to include Russia'

  setCenter(66, 99)
  setZoom(2)

setLocationFromDevice = (position) ->
  lat = position.coords.latitude
  lon = position.coords.longitude

  d "received coordinates #{lat}, #{lon} from URL"

  setCenter(lat, lon)
  setZoom(14)

position2uri = ->
  uri = "http://#{location.host}/#map=#{@zoom}/#{@lat}/#{@lon}"
  history.pushState(null, null, uri)

setCenter = (lat, lon, source_map_name) ->
  d "Center of #{source_map_name} map moved to #{lat}, #{lon}. Moving other maps..."
  map.setCenter(lat, lon) for name, map of maps when name != source_map_name
  [@lat, @lon] = [lat, lon]
  position2uri()

setZoom = (zoom, source_map_name) ->
  d "Zoom of #{source_map_name} map changed to #{zoom}. Zooming other maps..."
  map.setZoom(zoom) for name, map of maps when name != source_map_name
  @zoom = zoom
  position2uri()

################################################################################

window.onpopstate = setLocationFromUri

if location.hash.length > 1
  setLocationFromUri()
else
  setLocationToRussia()
  navigator.geolocation.getCurrentPosition(setLocationFromDevice)

maps = {}

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
