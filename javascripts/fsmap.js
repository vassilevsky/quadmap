(function() {
  var map, tagBuilding;

  map = L.map("map");

  map.addLayer(L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors"
  }));

  tagBuilding = function(e) {
    var building, building_id, levels, number, street;
    building = e.target;
    building_id = building.feature.properties.id;
    building.setStyle({
      color: "red"
    });
    number = prompt("Номер?");
    street = prompt("Улица?");
    levels = prompt("Этажей?");
    if (("" + number + street + levels).length > 0) {
      $.get("http://osm-addresser.herokuapp.com/record", {
        building_id: building_id,
        address: "" + street + " " + number + ", " + levels + " этажей"
      }, function(response) {
        return alert(response.status);
      }, "JSONP");
    }
    return building.setStyle({
      color: "green"
    });
  };

  $.getJSON("/unaddressed_buildings.geojson", function(data) {
    return map.addLayer(L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        return layer.on("click", tagBuilding);
      }
    }));
  });

  map.locate({
    watch: true,
    setView: true,
    timeout: 60 * 1000,
    enableHighAccuracy: true
  });

  window.map = map;

}).call(this);
