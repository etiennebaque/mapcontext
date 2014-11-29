/**
 * Created by etienne on 29/11/14.
 */

function initializeMap() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZXRpZW5uZWJhcXVlIiwiYSI6Ii1naTRRUDQifQ.3EtAu34jEgGWxUy4DCLzqA';
    var map = L.mapbox.map('map', 'examples.map-i86nkdio')
        .setView([40, -74.50], 9);
}
