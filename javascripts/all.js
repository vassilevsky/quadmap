(function() {
  var d, lat, lon, maps, setZoom, zoom;

  lat = 54.32;

  lon = 48.4;

  zoom = 14;

  maps = {};

  d = function() {
    return console.debug(arguments);
  };

  setZoom = function(source_map_name) {
    var new_zoom, target_map, target_map_name;
    new_zoom = maps[source_map_name].getZoom();
    for (target_map_name in maps) {
      target_map = maps[target_map_name];
      if (target_map_name !== source_map_name) {
        if (target_map.getZoom() !== new_zoom) {
          d("set " + target_map_name + " zoom to " + new_zoom);
          target_map.setZoom(new_zoom);
        }
      }
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
      return setZoom('osm');
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
      return setZoom('google');
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
