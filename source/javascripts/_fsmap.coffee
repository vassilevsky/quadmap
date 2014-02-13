lat = 54.32
lon = 48.4
zoom = 14

map1 = null
map2 = null
map3 = null
map4 = null


d = -> console.debug arguments


setZoom = (map, zoom) ->
  unless map.getZoom() == zoom
    d "setting map #{map} to zoom #{zoom}"
    map.setZoom zoom


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

    setZoom map2, new_zoom
    setZoom map3, new_zoom
    setZoom map4, new_zoom


google.maps.event.addDomListener window, 'load', ->
  map2 = new google.maps.Map document.getElementById('map2'),
    center: new google.maps.LatLng lat, lon
    zoom: zoom

  google.maps.event.addListener map2, 'dragend', ->
    new_center = map2.getCenter()
    new_zoom = map2.getZoom()

    map1.setView [new_center.lat(), new_center.lng()], new_zoom, reset: true
    map3.setCenter [new_center.lat(), new_center.lng()]
    map4.setCenter new DG.GeoPoint(new_center.lng(), new_center.lat())

  google.maps.event.addListener map2, 'zoom_changed', ->
    new_zoom = map2.getZoom()

    setZoom map1, new_zoom
    setZoom map3, new_zoom
    setZoom map4, new_zoom


ymaps.ready ->
  map3 = new ymaps.Map 'map3', center: [lat, lon], zoom: zoom


DG.autoload ->
  map4 = new DG.Map 'map4'
  map4.setCenter new DG.GeoPoint(lon, lat), zoom
