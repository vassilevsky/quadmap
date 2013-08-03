(function() {
  var DEFAULT_ZOOM, layer, map;

  DEFAULT_ZOOM = 10;

  map = L.map("map");

  layer = L.tileLayer("http://{s}.tile.cloudmade.com/5d0c99dd4e964633ac4c0176aa8d1a9e/997/256/{z}/{x}/{y}.png", {
    attribution: "Map data © CloudMade",
    maxZoom: 18
  });

  layer.addTo(map);

  navigator.geolocation.getCurrentPosition(function(position) {
    var lat, lon;
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    return map.setView([lat, lon], DEFAULT_ZOOM);
  });

  window.map = map;

}).call(this);
