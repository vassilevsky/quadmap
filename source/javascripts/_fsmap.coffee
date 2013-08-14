DEFAULT_ZOOM = 18

map = L.map("map")

layer = L.tileLayer "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "Map data © OpenStreetMap contributors"

layer.addTo map

tagBuilding = (e) ->
  building_id = e.target.feature.properties.id
  address = prompt "Адрес этого дома:"
  $.get "http://osm-addresser.herokuapp.com/record",
    building_id: building_id
    address: address
    (response) -> alert response.status
    "JSONP"

$.getJSON "/unaddressed_buildings.geojson", (data) ->
  buildings = L.geoJson data,
    onEachFeature: (feature, layer) ->
      layer.on "click", tagBuilding

  buildings.addTo(map)

navigator.geolocation.getCurrentPosition (position) ->
  lat = position.coords.latitude
  lon = position.coords.longitude
  map.setView [lat, lon], DEFAULT_ZOOM

window.map = map
