(function() {
  var d, lat, lon, maps, setZoom, zoom;

  lat = 54.32;

  lon = 48.4;

  zoom = 14;

  maps = {};

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
    maps.osm = new L.Map('map1');
    maps.osm.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }));
    maps.osm.setView([lat, lon], zoom);
    maps.osm.on('dragend', function() {
      var new_center;
      new_center = maps.osm.getCenter();
      maps.google.setCenter(new google.maps.LatLng(new_center.lat, new_center.lng));
      maps.yandex.setCenter([new_center.lat, new_center.lng]);
      return maps.dgis.setCenter(new DG.GeoPoint(new_center.lng, new_center.lat));
    });
    return maps.osm.on('zoomend', function() {
      var new_zoom;
      new_zoom = maps.osm.getZoom();
      setZoom(maps.google, new_zoom);
      setZoom(maps.yandex, new_zoom);
      return setZoom(maps.dgis, new_zoom);
    });
  };

  google.maps.event.addDomListener(window, 'load', function() {
    maps.google = new google.maps.Map(document.getElementById('map2'), {
      center: new google.maps.LatLng(lat, lon),
      zoom: zoom
    });
    google.maps.event.addListener(maps.google, 'dragend', function() {
      var new_center, new_zoom;
      new_center = maps.google.getCenter();
      new_zoom = maps.google.getZoom();
      maps.osm.setView([new_center.lat(), new_center.lng()], new_zoom, {
        reset: true
      });
      maps.yandex.setCenter([new_center.lat(), new_center.lng()]);
      return maps.dgis.setCenter(new DG.GeoPoint(new_center.lng(), new_center.lat()));
    });
    return google.maps.event.addListener(maps.google, 'zoom_changed', function() {
      var new_zoom;
      new_zoom = maps.google.getZoom();
      setZoom(maps.osm, new_zoom);
      setZoom(maps.yandex, new_zoom);
      return setZoom(maps.dgis, new_zoom);
    });
  });

  ymaps.ready(function() {
    return maps.yandex = new ymaps.Map('map3', {
      center: [lat, lon],
      zoom: zoom
    });
  });

  DG.autoload(function() {
    maps.dgis = new DG.Map('map4');
    return maps.dgis.setCenter(new DG.GeoPoint(lon, lat), zoom);
  });

}).call(this);
