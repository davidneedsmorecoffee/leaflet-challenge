// set up queryurl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// plot a second data set on your map to illustrate the relationship between tectonic plates and seismic activity. 
// You will need to pull in a second data set and visualize it along side your original set of data. 
// Data on tectonic plates can be found at https://github.com/fraxen/tectonicplates. tetonic plate
// https://github.com/fraxen/tectonicplates/tree/master/GeoJSON
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// 17_01_10-Stu_Geo-Json
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

// //17_01_08-Ins_Layers
var tectonic = new L.LayerGroup();

// 17_02_01-Evr_BasicNYCBoroughs
// Grabbing our GeoJson data
d3.json(tectonicUrl, function(tecData) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(tecData, {
    color: "LightSeaGreen",
    fillOpacity: 0.5,
    opacity: 0.8,
    weight: 1.2
  })
  .addTo(tectonic);  
});

// 17_1_10-Stu_Geo-Json
function createFeatures(earthquakeData, ) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
    layer.bindPopup(
        "<h2>Magnitude: " + feature.properties.mag +
        "</h2><h3>Location: "+ feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</p>"
    )};

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        // https://leafletjs.com/examples/geojson/
        // https://leafletjs.com/reference-1.3.0.html
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: radiusAs(feature.properties.mag),
              fillColor: colorAs(feature.properties.mag),
              fillOpacity: .8,
              color: "#000",
              stroke: true,
              weight: .5
        })
    }
    });
     // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// 17_1_10-Stu_Geo-Json
function createMap(earthquakes) {

    // Define map layers
    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY
    });
    
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Outdoors Map": outdoors,
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "Satellite Map": satellite
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes,
      "Tectonic Plates": tectonic
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [outdoors, earthquakes, tectonic]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // 17_02_04-Par_MoneyChoropleth
    // Set up the legend
    var legend = L.control({position: "bottomleft"});
    legend.onAdd = function(myMap){
      var div = L.DomUtil.create('div', 'info legend');
      var grades = [0, 1, 2, 3, 4, 5];
      var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      var colors = ["#b7f34d", "#e0f34d", "#f3da4d", "#f3b94d", "#f0a76b", "#f06b6b"];
      
    // for each grade generate portion of the legend with the corresponding color and label
      grades.forEach(i => {
        div.innerHTML +=
        '<ul style="list-style: none; " >' + 
          '<li style="background:' + colors[i] + '">' + '&nbsp' + labels[i] + '&nbsp' + '</li>' 
        '</ul>';
        });
      return div;
      };
      // Adding legend to the map
      legend.addTo(myMap)
};

// Use the mag of earthquake and multiple this value by a factor (e.g., 30000) 
// this is to generate the radius of the circle big enough to see on map
function radiusAs(value){
    return value*30000
}

// use combination of mspaint and RGB to HEX to determine color to match guide
// https://javascript.info/ifelse
// https://www.digitalocean.com/community/tutorials/how-to-write-conditional-statements-in-javascript
function colorAs(magnitude) {
    return (magnitude > 5) ? "#f06b6b":
    (magnitude > 4) ? "#f0a76b":
    (magnitude > 3) ? "#f3b94d":
    (magnitude > 2) ? "#f3da4d":
    (magnitude > 1) ? "#e0f34d": "#b7f34d";
  }
