/*
 * basemap and colors
 */
var map = L.map('map', {
  renderer: L.svg()
}).setView([47.6797, -122.3257], 13);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
}).addTo(map); 


var colour = '#FF0000';
var jcolour = '#0000FF';
var pcolour = '#00FF00';

var rank_opacity = { 
  1: '0.0',
  2: '0.2',
  3: '0.4',
  4: '0.6',
  5: '0.8',
};


function featureColour (feature) {
  return {
    color: colour,
    fill: colour,
    fillOpacity: 0.2 
  };
}

function jobColour (feature) {
  return {
    color: jcolour,
    fill: jcolour,
    fillOpacity: 0.2 
  };
}

function popColour (feature) {
  return {
    color: pcolour,
    fill: pcolour,
    fillOpacity: 0.2 
  };
}

/*
 * setup and JSON
 */
function setup (geoJ, paneName) {
  L.geoJson(geoJ, {
    pane: paneName,
    style: featureColour
  }).addTo(map);
}

function jsetup (geoJ, paneName) {
  L.geoJson(geoJ, {
    pane: paneName,
    style: jobColour
  }).addTo(map);
}

function psetup (geoJ, paneName) {
  L.geoJson(geoJ, {
    pane: paneName,
    style: popColour
  }).addTo(map);
}

$.getJSON('JSON/West.geojson', function (data) {
  var a = [data];
  setup(a);
});

$.getJSON('JSON/South.geojson', function (data) {
  var a = [data];
  setup(a);
});

$.getJSON('JSON/East.geojson', function (data) {
  var a = [data];
  setup(a);
});

$.getJSON('JSON/JobDensity.geojson', function (data) {
  var a = [data];
  jsetup(a);
});

$.getJSON('JSON/PopDensity.geojson', function (data) {
  var a = [data];
  psetup(a);
});

/*
 * legend
 */
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [1,2,3],
      labels = [];

  for (var i = 0; i < grades.length; i++) {
    if (grades[i] === 1) {
      div.innerHTML +=
        '<i style="background:' + colour + '"></i> ' +
        'walkability' + (grades[i] ? '<br>' : ' ');
    } else if (grades[i] === 2) {
      div.innerHTML +=
        '<i style="background:' + jcolour + '"></i> ' +
        'high job density' + (grades[i] ? '<br>' : ' ');
    }
    /*
    else {
      div.innerHTML +=
        '<i style="background:' + colour + '; opacity:' + rank_opacity[grades[i]] + '"></i> ' +
        '.' + (grades[i] ? '<br>' : ' ');
    }
    */
  }
  return div;
};

legend.addTo(map);

function style(feature) {
    return {
        fillColor: 'grey',
        weight: 2,
        opacity: 1,
        color: 'grey',
        fillOpacity: 0.1
    };
}

/*
 * behavior
 */
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        stroke: 'grey'
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    hover.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    hover.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

/*
var hover = L.control();

hover.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'hover'); // create a div with a class "hover"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
hover.update = function (props) {
    this._div.innerHTML = '<h5>You are currently looking at:</h5>' +  (props ?
        '<b>' + props.PlaceName : 'Nothing! Hover over a municipality');
};

hover.addTo(map);

var boundaries = map.createPane('boundaries');
$.getJSON('boundaries.geojson', function (data) {
  var boundariesdata = [data];
  // Add features to the map
  geojson = L.geoJson(boundariesdata, {
    onEachFeature: onEachFeature,
    style: style,
    pane: boundaries
  }).addTo(map);
});
*/
