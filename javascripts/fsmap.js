(function() {
  var DEFAULT_ZOOM, layer, map, tagBuilding;

  DEFAULT_ZOOM = 18;

  map = L.map("map");

  layer = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors"
  });

  layer.addTo(map);

  tagBuilding = function(e) {
    var address, building, building_id;
    building = e.target;
    building_id = building.feature.properties.id;
    address = prompt("Адрес этого дома:");
    if (address.length > 0) {
      $.get("http://osm-addresser.herokuapp.com/record", {
        building_id: building_id,
        address: address
      }, function(response) {
        return alert(response.status);
      }, "JSONP");
    }
    return building.setStyle({
      color: "green"
    });
  };

  $.getJSON("/unaddressed_buildings.geojson", function(data) {
    var buildings;
    buildings = L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        return layer.on("click", tagBuilding);
      }
    });
    return buildings.addTo(map);
  });

  map.locate({
    watch: true,
    setView: true,
    timeout: 60 * 1000,
    enableHighAccuracy: true
  });

  window.map = map;

}).call(this);
