/**
 * Created by etienne on 29/11/14.
 */

function initializeMap() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZXRpZW5uZWJhcXVlIiwiYSI6Ii1naTRRUDQifQ.3EtAu34jEgGWxUy4DCLzqA';
    map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([40.4406248, -79.9958864], 6);
    // cartodb.createLayer('map',path/to/viz.json).addTo(map);
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

function putLocationMarkers(locations_hash){

    Object.keys(locations_hash).forEach(function (loc_key) {
        var location = locations_hash[loc_key];

        var html = "<strong>"+loc_key+"</strong> - Related stories<br><br><ul>";

        console.log(location['articles']);

        for (var i = 0; i < location['articles'].length; i++){
            html = html + "<li>"+location['articles'][i]['title']+" - <a href='"+location['articles'][i]['url']+"' target='_blank'>Read article</a></li>";
        }

        html = html + "</ul>"

        L.marker([location['latitude'], location['longitude']]).addTo(map)
            .bindPopup(html).openPopup();

    })

}
