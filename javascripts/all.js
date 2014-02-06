(function() {
  var lat, lon, map1, map2, map3, zoom;

  lat = 54.32;

  lon = 48.4;

  zoom = 14;

  map1 = null;

  map2 = null;

  map3 = null;

  window.onload = function() {
    map1 = new L.Map('map1');
    map1.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }));
    map1.setView([lat, lon], zoom);
    map1.on('moveend', function() {
      var new_center;
      new_center = map1.getCenter();
      map2.panTo(new google.maps.LatLng(new_center.lat, new_center.lng));
      return map3.panTo([new_center.lat, new_center.lng]);
    });
    return map1.on('zoomend', function() {
      var new_zoom;
      new_zoom = map1.getZoom();
      map2.setZoom(new_zoom);
      return map3.setZoom(new_zoom);
    });
  };

  google.maps.event.addDomListener(window, 'load', function() {
    return map2 = new google.maps.Map(document.getElementById('map2'), {
      center: new google.maps.LatLng(lat, lon),
      zoom: zoom
    });
  });

  ymaps.ready(function() {
    return map3 = new ymaps.Map('map3', {
      center: [lat, lon],
      zoom: zoom
    });
  });

}).call(this);
