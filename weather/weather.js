var map = L.map('map').setView([44.2, -114.5], 6);

var basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

var basemap = L.tileLayer(basemapUrl).addTo(map);
