lat = 54.32
lon = 48.4
zoom = 14

maps = {}


d = -> console.debug arguments


setCenter = (lat, lon, source_map_name) ->
  d '====='
  d "HAVE TO MOVE OTHER MAPS BECAUSE #{source_map_name} HAS MOVED"

  unless source_map_name is 'osm'
    d "set osm center to #{lat}, #{lon}"
    maps.osm.setView [lat, lon], maps.osm.getZoom(), reset: true

  unless source_map_name is 'google'
    d "set google center to #{lat}, #{lon}"
    maps.google.setCenter new google.maps.LatLng lat, lon

  unless source_map_name is 'yandex'
    d "set yandex center to #{lat}, #{lon}"
    maps.yandex.events.remove 'boundschange', yandex_change_handler
    maps.yandex.setCenter [lat, lon]
    maps.yandex.events.add 'boundschange', yandex_change_handler

  unless source_map_name is 'dgis'
    d "set dgis center to #{lat}, #{lon}"
    dgis_zoom_observer.disable()
    maps.dgis.setCenter new DG.GeoPoint lon, lat
    dgis_zoom_observer.enable()

  return


setZoom = (source_map_name) ->
  d '====='
  d "HAVE TO ZOOM OTHER MAPS BECAUSE #{source_map_name} HAS CHANGED ZOOM"

  new_zoom = maps[source_map_name].getZoom()

  for target_map_name, target_map of maps when target_map_name isnt source_map_name
    if target_map.getZoom() isnt new_zoom
      d "set #{target_map_name} zoom to #{new_zoom}"
      target_map.setZoom new_zoom

  return


window.onload = ->
  maps.osm = new L.Map 'map1'

  maps.osm.addLayer new L.TileLayer 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'

  maps.osm.setView [lat, lon], zoom

  maps.osm.on 'dragend', ->
    new_center = maps.osm.getCenter()
    setCenter new_center.lat, new_center.lng, 'osm'

  maps.osm.on 'zoomend', ->
    setZoom 'osm'


google.maps.event.addDomListener window, 'load', ->
  maps.google = new google.maps.Map document.getElementById('map2'),
    center: new google.maps.LatLng lat, lon
    zoom: zoom

  google.maps.event.addListener maps.google, 'dragend', ->
    new_center = maps.google.getCenter()
    setCenter new_center.lat(), new_center.lng(), 'google'

  google.maps.event.addListener maps.google, 'zoom_changed', ->
    setZoom 'google'


yandex_change_handler = (event) ->
  new_center = event.get('newCenter')

  if new_center != event.get('oldCenter')
    setCenter new_center[0], new_center[1], 'yandex'

  if event.get('newZoom') != event.get('oldZoom')
    setZoom 'yandex'

ymaps.ready ->
  maps.yandex = new ymaps.Map 'map3', center: [lat, lon], zoom: zoom
  maps.yandex.events.add 'boundschange', yandex_change_handler


dgis_zoom_observer = null

DG.autoload ->
  maps.dgis = new DG.Map 'map4'
  maps.dgis.setCenter new DG.GeoPoint(lon, lat), zoom

  maps.dgis.addEventListener 'map4', 'DgDragStop', ->
    new_center = maps.dgis.getCenter()
    setCenter new_center.lat, new_center.lon, 'dgis'

  dgis_zoom_observer = maps.dgis.addEventListener 'map4', 'DgZoomChange', ->
    setZoom 'dgis'
