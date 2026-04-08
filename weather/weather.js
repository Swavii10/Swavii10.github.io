var map = L.map('map').setView([38, -95], 4);

var basemapUrl = 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

var basemap = L.tileLayer(basemapUrl).addTo(map);
// State boundaries
var statesUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

$.getJSON(statesUrl, function(data) {
  L.geoJSON(data, {
    style: {
      color: 'white',
      weight: 2,
      fill: false
    }
  }).addTo(map);
});
var radarUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
var radarDisplayOptions = {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true
};
var radar = L.tileLayer.wms(radarUrl, radarDisplayOptions).addTo(map);
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';

$.getJSON(weatherAlertsUrl, function(data) {

  L.geoJSON(data, {

    style: function(feature){
  var alertColor = 'orange';

  if (feature.properties.severity === 'Severe') {
    alertColor = 'red';
  }

  if (feature.properties.severity === 'Extreme') {
    alertColor = 'purple';
  }

  if (feature.properties.severity === 'Minor') {
    alertColor = 'yellow';
  }

  return { color: alertColor };
},

    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.headline);
    }

  }).addTo(map);

});
// Click anywhere → show coordinates + state
map.on('click', function(e) {

  var lat = e.latlng.lat.toFixed(4);
  var lon = e.latlng.lng.toFixed(4);

  var message = "Lat: " + lat + "<br>Lon: " + lon;

  $.getJSON('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json', function(data) {

    var stateName = "Unknown";

    data.features.forEach(function(feature) {
      if (turf.booleanPointInPolygon(
        turf.point([lon, lat]),
        feature
      )) {
        stateName = feature.properties.name;
      }
    });

    L.popup()
      .setLatLng(e.latlng)
      .setContent(message + "<br>State: " + stateName)
      .openOn(map);
  });

});
