map = L.map("map")

map.addLayer L.tileLayer "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "Map data © OpenStreetMap contributors"

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
      address: "#{number} #{street}, #{levels} этажей"
      (response) -> alert response.status
      "JSONP"

  building.setStyle color: "green"

$.getJSON "/unaddressed_buildings.geojson", (data) ->
  map.addLayer L.geoJson data,
    onEachFeature: (feature, layer) ->
      layer.on "click", tagBuilding

map.locate
  watch: true
  setView: true
  timeout: 60 * 1000
  enableHighAccuracy: true

window.map = map
