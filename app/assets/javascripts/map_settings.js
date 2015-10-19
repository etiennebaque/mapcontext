function initializeMap() {

    L.mapbox.accessToken = 'pk.eyJ1IjoiZXRpZW5uZWJhcXVlIiwiYSI6Ii1naTRRUDQifQ.3EtAu34jEgGWxUy4DCLzqA';
    map = L.mapbox.map('map', 'mapbox.streets').setView([40.4406248, -79.9958864], 5);
    
}

function getSelected() {
    if (window.getSelection) {
        return window.getSelection();
    }
    else if (document.getSelection) {
        return document.getSelection();
    }
    else {
        var selection = document.selection && document.selection.createRange();
        if (selection.text) {
            return selection.text;
        }
        return false;
    }
    return false;
}

function putLocationStoriesGeoMarkers(json){
    /*var testlayer = L.geoJson(json, {
        onEachFeature: onEachFeature
    });*/

    //var testlayer = L.geoJson(json);

    /*var sliderControl = L.control.sliderControl({
        position: "topright",
        layer: testlayer,
        follow: true
    });*/

    var test = json['test'];
    var test_array = [];
    for (var i = 0; i < test.length; i++){
        test_array.push(L.marker([test[i][0], test[i][1]], test[i][2]).bindPopup(test[i][3]));
    }

    layerGroup = L.layerGroup(test_array);
    var sliderControl = L.control.sliderControl({
        layer:layerGroup
    });
    //Make sure to add the slider to the map ;-)
    map.addControl(sliderControl);
    //An initialize the slider
    sliderControl.startSlider();
}

function onEachFeature(feature, layer) {
    var loc_articles = feature.properties.articles;
    var html = "<strong>"+feature.city+"</strong> - Related stories to tag<br><br><ul>";

    for (var i = 0; i < loc_articles.length; i++){
        var article = loc_articles[i];
        html = html + "<li>"+article['title']+" - <a href='"+article['url']+"' target='_blank'>Read article</a></li>";
    }
    html = html + "</ul>"

    layer.bindPopup(html);
}

function putLocationStoriesMarkers(locations_hash){

    var tag_value = locations_hash['tag'];
    var location_results = locations_hash['result'];

    Object.keys(location_results).forEach(function (loc_key) {
        var location = location_results[loc_key];

        var html = "<strong>"+loc_key+"</strong> - Related stories to '"+tag_value+"'<br><br><ul>";

        for (var i = 0; i < location['articles'].length; i++){
            html = html + "<li>"+location['articles'][i]['title']+" - <a href='"+location['articles'][i]['url']+"' target='_blank'>Read article</a></li>";
        }

        html = html + "</ul>"

        if (location['more'] == true){
            html = html + "<br><a href='#'>See more...</a>";
        }

        L.marker([location['latitude'], location['longitude']]).addTo(map)
            .bindPopup(html).openPopup();

    })
}


function putLocationMarker(location){

    var html = location['city'];

    L.marker(([location['latitude'], location['longitude']]), {icon: newIcon}).addTo(map).bindPopup(html).openPopup();

}