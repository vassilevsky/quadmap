d = -> console.debug arguments

if window.location.hash.length > 1
  [zoom, lat, lon] = window.location.hash.replace('#', '').split('/')

  zoom = parseInt(zoom)
  lat = parseFloat(lat)
  lon = parseFloat(lon)

  d "received initial zoom #{zoom} and coordinates #{lat}, #{lon} from URL"
else
  [zoom, lat, lon] = [14, 54.32, 48.4]

maps = {}

setCenter = (lat, lon, source_map_name) ->
  d '====='
  d "HAVE TO MOVE OTHER MAPS BECAUSE #{source_map_name} HAS MOVED"

  unless source_map_name is 'osm'
    d "set osm center to #{lat}, #{lon}"
    maps.osm.setCenter(lat, lon)

  unless source_map_name is 'google'
    d "set google center to #{lat}, #{lon}"
    maps.google.setCenter(lat, lon)

  unless source_map_name is 'yandex'
    d "set yandex center to #{lat}, #{lon}"
    maps.yandex.setCenter(lat, lon)

  unless source_map_name is 'dgis'
    d "set dgis center to #{lat}, #{lon}"
    maps.dgis.setCenter(lat, lon)

  return


setZoom = (source_map_name) ->
  d '====='
  d "HAVE TO ZOOM OTHER MAPS BECAUSE #{source_map_name} HAS CHANGED ZOOM"

  new_zoom = maps[source_map_name].getZoom()

  unless source_map_name is 'osm'
    unless maps.osm.getZoom() == new_zoom
      d "set osm zoom to #{new_zoom}"
      maps.osm.setZoom(new_zoom)

  unless source_map_name is 'google'
    unless maps.google.getZoom() == new_zoom
      d "set google zoom to #{new_zoom}"
      maps.google.setZoom(new_zoom)

  unless source_map_name is 'yandex'
    unless maps.yandex.getZoom() == new_zoom
      d "set yandex zoom to #{new_zoom}"
      maps.yandex.setZoom(new_zoom)

  unless source_map_name is 'dgis'
    unless maps.dgis.getZoom() == new_zoom
      d "set dgis zoom to #{new_zoom}"
      maps.dgis.setZoom(new_zoom)

  return


window.onload = ->
  maps.osm = new OpenStreetMap('map1', lat, lon, zoom)

  maps.osm.setCenterChangeHandler (lat, lon) =>
    setCenter(lat, lon, 'osm')

  maps.osm.setZoomChangeHandler (zoom) =>
    setZoom('osm')


google.maps.event.addDomListener window, 'load', ->
  maps.google = new GoogleMaps('map2', lat, lon, zoom)

  maps.google.setCenterChangeHandler (lat, lon) =>
    setCenter(lat, lon, 'google')

  maps.google.setZoomChangeHandler (zoom) =>
    setZoom('google')


ymaps.ready ->
  maps.yandex = new YandexMaps('map3', lat, lon, zoom)

  maps.yandex.setCenterChangeHandler (lat, lon) =>
    setCenter(lat, lon, 'yandex')

  maps.yandex.setZoomChangeHandler (zoom) =>
    setZoom('yandex')


DG.autoload ->
  maps.dgis = new DoubleGisMap('map4', lat, lon, zoom)

  maps.dgis.setCenterChangeHandler (lat, lon) ->
    setCenter(lat, lon, 'dgis')

  maps.dgis.setZoomChangeHandler (zoom) ->
    setZoom('dgis')
