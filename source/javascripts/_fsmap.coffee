DEFAULT_ZOOM = 18

map = L.map("map")

layer = L.tileLayer "http://{s}.tile.cloudmade.com/5d0c99dd4e964633ac4c0176aa8d1a9e/997/256/{z}/{x}/{y}.png",
  attribution: "Map data © CloudMade"
  maxZoom: 18

layer.addTo map

$.getJSON "/unaddressed_buildings.geojson", (data) -> L.geoJson(data).addTo(map)

navigator.geolocation.getCurrentPosition (position) ->
  lat = position.coords.latitude
  lon = position.coords.longitude
  map.setView [lat, lon], DEFAULT_ZOOM

window.map = map
