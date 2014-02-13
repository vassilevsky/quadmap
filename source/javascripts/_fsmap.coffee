lat = 54.32
lon = 48.4
zoom = 14

maps = {}


d = -> console.debug arguments


setZoom = (map, zoom) ->
  unless map.getZoom() == zoom
    d "setting map #{map} to zoom #{zoom}"
    map.setZoom zoom


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
    new_zoom = maps.osm.getZoom()

    setZoom maps.google, new_zoom
    setZoom maps.yandex, new_zoom
    setZoom maps.dgis, new_zoom


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
    new_zoom = maps.google.getZoom()

    setZoom maps.osm, new_zoom
    setZoom maps.yandex, new_zoom
    setZoom maps.dgis, new_zoom


ymaps.ready ->
  maps.yandex = new ymaps.Map 'map3', center: [lat, lon], zoom: zoom


DG.autoload ->
  maps.dgis = new DG.Map 'map4'
  maps.dgis.setCenter new DG.GeoPoint(lon, lat), zoom
