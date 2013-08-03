map = L.map("map").setView [51.505, -0.09], 13

layer = L.tileLayer "http://{s}.tile.cloudmade.com/5d0c99dd4e964633ac4c0176aa8d1a9e/997/256/{z}/{x}/{y}.png",
  attribution: "Map data © CloudMade"
  maxZoom: 18

layer.addTo map
