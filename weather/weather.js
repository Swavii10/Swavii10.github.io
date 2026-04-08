var map = L.map('map').setView([38, -95], 4);

var basemapUrl = 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

var basemap = L.tileLayer(basemapUrl).addTo(map);
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
