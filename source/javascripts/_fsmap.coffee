lat = 54.32
lon = 48.4
zoom = 14

map1 = null
map2 = null
map3 = null
map4 = null


window.onload = ->
  map1 = new L.Map 'map1'

  map1.addLayer new L.TileLayer 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'

  map1.setView [lat, lon], zoom

  map1.on 'dragend', ->
    new_center = map1.getCenter()

    map2.setCenter new google.maps.LatLng new_center.lat, new_center.lng
    map3.setCenter [new_center.lat, new_center.lng]
    map4.setCenter new DG.GeoPoint(new_center.lng, new_center.lat)

  map1.on 'zoomend', ->
    new_zoom = map1.getZoom()

    map2.setZoom new_zoom
    map3.setZoom new_zoom
    map4.setZoom new_zoom


google.maps.event.addDomListener window, 'load', ->
  map2 = new google.maps.Map document.getElementById('map2'),
    center: new google.maps.LatLng lat, lon
    zoom: zoom


ymaps.ready ->
  map3 = new ymaps.Map 'map3', center: [lat, lon], zoom: zoom


DG.autoload ->
  map4 = new DG.Map 'map4'
  map4.setCenter new DG.GeoPoint(lon, lat), zoom
