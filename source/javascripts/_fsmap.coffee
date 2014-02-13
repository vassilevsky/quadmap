lat = 54.32
lon = 48.4
zoom = 14

maps = {}


d = -> console.debug arguments


setZoom = (source_map_name) ->
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

    maps.google.setCenter new google.maps.LatLng new_center.lat, new_center.lng
    maps.yandex.setCenter [new_center.lat, new_center.lng]
    maps.dgis.setCenter new DG.GeoPoint new_center.lng, new_center.lat

  maps.osm.on 'zoomend', ->
    setZoom 'osm'


google.maps.event.addDomListener window, 'load', ->
  maps.google = new google.maps.Map document.getElementById('map2'),
    center: new google.maps.LatLng lat, lon
    zoom: zoom

  google.maps.event.addListener maps.google, 'dragend', ->
    new_center = maps.google.getCenter()
    new_zoom = maps.google.getZoom()

    maps.osm.setView [new_center.lat(), new_center.lng()], new_zoom, reset: true
    maps.yandex.setCenter [new_center.lat(), new_center.lng()]
    maps.dgis.setCenter new DG.GeoPoint new_center.lng(), new_center.lat()

  google.maps.event.addListener maps.google, 'zoom_changed', ->
    setZoom 'google'


ymaps.ready ->
  maps.yandex = new ymaps.Map 'map3', center: [lat, lon], zoom: zoom


DG.autoload ->
  maps.dgis = new DG.Map 'map4'
  maps.dgis.setCenter new DG.GeoPoint(lon, lat), zoom
