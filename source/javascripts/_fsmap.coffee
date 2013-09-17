map = L.map("map")

map.addLayer L.tileLayer "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "Map data © OpenStreetMap contributors"

map.locate
  setView: true
  timeout: 60 * 1000
  enableHighAccuracy: true

window.map = map
