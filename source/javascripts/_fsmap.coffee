lat = 54.32
lon = 48.4
zoom = 14

map1 = null
map2 = null
map3 = null


window.onload = ->
  map1 = new L.Map 'map1'

  map1.addLayer new L.TileLayer 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'

  map1.setView [lat, lon], zoom

  map1.on 'moveend', ->
    new_center = map1.getCenter()
    map2.panTo new google.maps.LatLng new_center.lat, new_center.lng
    map3.panTo [new_center.lat, new_center.lng]


google.maps.event.addDomListener window, 'load', ->
  map2 = new google.maps.Map document.getElementById('map2'),
    center: new google.maps.LatLng lat, lon
    zoom: zoom


ymaps.ready ->
  map3 = new ymaps.Map 'map3', center: [lat, lon], zoom: zoom
