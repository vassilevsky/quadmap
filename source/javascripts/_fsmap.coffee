map = L.map("map")

layer = L.tileLayer "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "Map data © OpenStreetMap contributors"

layer.addTo map

tagBuilding = (e) ->
  building = e.target
  building_id = building.feature.properties.id

  building.setStyle color: "red"

  number = prompt "Номер?"
  street = prompt "Улица?"
  levels = prompt "Этажей?"

  if "#{number}#{street}#{levels}".length > 0
    $.get "http://osm-addresser.herokuapp.com/record",
      building_id: building_id
      address: "#{street} #{number}, #{levels} этажей"
      (response) -> alert response.status
      "JSONP"

  building.setStyle color: "green"

$.getJSON "/unaddressed_buildings.geojson", (data) ->
  buildings = L.geoJson data,
    onEachFeature: (feature, layer) ->
      layer.on "click", tagBuilding

  buildings.addTo(map)

map.locate
  watch: true
  setView: true
  timeout: 60 * 1000
  enableHighAccuracy: true

window.map = map
