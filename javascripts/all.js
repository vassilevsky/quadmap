(function() {
  var d, lat, lon, map1, map2, map3, map4, setZoom, zoom;

  lat = 54.32;

  lon = 48.4;

  zoom = 14;

  map1 = null;

  map2 = null;

  map3 = null;

  map4 = null;

  d = function() {
    return console.debug(arguments);
  };

  setZoom = function(map, zoom) {
    if (map.getZoom() !== zoom) {
      d("setting map " + map + " to zoom " + zoom);
      return map.setZoom(zoom);
    }
  };

  window.onload = function() {
    map1 = new L.Map('map1');
    map1.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }));
    map1.setView([lat, lon], zoom);
    map1.on('dragend', function() {
      var new_center;
      new_center = map1.getCenter();
      map2.setCenter(new google.maps.LatLng(new_center.lat, new_center.lng));
      map3.setCenter([new_center.lat, new_center.lng]);
      return map4.setCenter(new DG.GeoPoint(new_center.lng, new_center.lat));
    });
    return map1.on('zoomend', function() {
      var new_zoom;
      new_zoom = map1.getZoom();
      setZoom(map2, new_zoom);
      setZoom(map3, new_zoom);
      return setZoom(map4, new_zoom);
    });
  };

  google.maps.event.addDomListener(window, 'load', function() {
    map2 = new google.maps.Map(document.getElementById('map2'), {
      center: new google.maps.LatLng(lat, lon),
      zoom: zoom
    });
    google.maps.event.addListener(map2, 'dragend', function() {
      var new_center, new_zoom;
      new_center = map2.getCenter();
      new_zoom = map2.getZoom();
      map1.setView([new_center.lat(), new_center.lng()], new_zoom, {
        reset: true
      });
      map3.setCenter([new_center.lat(), new_center.lng()]);
      return map4.setCenter(new DG.GeoPoint(new_center.lng(), new_center.lat()));
    });
    return google.maps.event.addListener(map2, 'zoom_changed', function() {
      var new_zoom;
      new_zoom = map2.getZoom();
      setZoom(map1, new_zoom);
      setZoom(map3, new_zoom);
      return setZoom(map4, new_zoom);
    });
  });

  ymaps.ready(function() {
    return map3 = new ymaps.Map('map3', {
      center: [lat, lon],
      zoom: zoom
    });
  });

  DG.autoload(function() {
    map4 = new DG.Map('map4');
    return map4.setCenter(new DG.GeoPoint(lon, lat), zoom);
  });

}).call(this);
