(function() {
  var DEFAULT_ZOOM, layer, map;

  DEFAULT_ZOOM = 18;

  map = L.map("map");

  layer = L.tileLayer("http://{s}.tile.cloudmade.com/5d0c99dd4e964633ac4c0176aa8d1a9e/997/256/{z}/{x}/{y}.png", {
    attribution: "Map data © CloudMade",
    maxZoom: 18
  });

  layer.addTo(map);

  $.getJSON("/unaddressed_buildings.geojson", function(data) {
    var buildings;
    buildings = L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        return layer.on("click", function(e) {
          var address, building_id;
          building_id = e.target.feature.properties.id;
          address = prompt("Адрес этого дома:");
          return $.get("http://osm-addresser.herokuapp.com/record", {
            building_id: building_id,
            address: address
          }, function(response) {
            return alert(response.status);
          }, "JSONP");
        });
      }
    });
    return buildings.addTo(map);
  });

  navigator.geolocation.getCurrentPosition(function(position) {
    var lat, lon;
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    return map.setView([lat, lon], DEFAULT_ZOOM);
  });

  window.map = map;

}).call(this);
