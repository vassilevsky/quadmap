(function() {
  var d, lat, lon, maps, setCenter, setZoom, zoom;

  lat = 54.32;

  lon = 48.4;

  zoom = 14;

  maps = {};

  d = function() {
    return console.debug(arguments);
  };

  setCenter = function(lat, lon, except_map_name) {
    if (except_map_name !== 'osm') {
      d("set osm center to " + lat + ", " + lon);
      maps.osm.setView([lat, lon], maps.osm.getZoom(), {
        reset: true
      });
    }
    if (except_map_name !== 'google') {
      d("set google center to " + lat + ", " + lon);
      maps.google.setCenter(new google.maps.LatLng(lat, lon));
    }
    if (except_map_name !== 'yandex') {
      d("set yandex center to " + lat + ", " + lon);
      maps.yandex.setCenter([lat, lon]);
    }
    if (except_map_name !== 'dgis') {
      d("set dgis center to " + lat + ", " + lon);
      maps.dgis.setCenter(new DG.GeoPoint(lon, lat));
    }
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
      return setCenter(new_center.lat, new_center.lng, 'osm');
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
      var new_center;
      new_center = maps.google.getCenter();
      return setCenter(new_center.lat(), new_center.lng(), 'google');
    });
    return google.maps.event.addListener(maps.google, 'zoom_changed', function() {
      return setZoom('google');
    });
  });

  ymaps.ready(function() {
    maps.yandex = new ymaps.Map('map3', {
      center: [lat, lon],
      zoom: zoom
    });
    return maps.yandex.events.add('boundschange', function(event) {
      var new_center;
      new_center = event.get('newCenter');
      if (new_center !== event.get('oldCenter')) {
        setCenter(new_center[0], new_center[1], 'yandex');
      }
      if (event.get('newZoom') !== event.get('oldZoom')) {
        return setZoom('yandex');
      }
    });
  });

  DG.autoload(function() {
    maps.dgis = new DG.Map('map4');
    return maps.dgis.setCenter(new DG.GeoPoint(lon, lat), zoom);
  });

}).call(this);
