const coordinates = JSON.parse(document.getElementById('map').dataset.coordinates);
const defaultCenter = [77.2090, 28.6139]; // Delhi as default
const mapCenter = coordinates.length ? coordinates : defaultCenter;
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: mapCenter, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

console.log('Initial coordinates:', coordinates);
let marker;
let popup;
if (coordinates.length) {
    popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML("<h6>Exact location will be provided after booking</h6>");
    marker = new mapboxgl.Marker().setLngLat(coordinates).setPopup(popup).addTo(map);
}

// For edit
const locationInput = document.getElementById('location');
if (locationInput) {
    locationInput.addEventListener('input', async function() {
        const query = this.value.trim();
        console.log('Location input:', query);
        if (query) {
            try {
                const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${maptoken}`);
                const data = await response.json();
                console.log('Geocoding response:', data);
                if (data.features && data.features.length > 0) {
                    const newCoords = data.features[0].center;
                    console.log('New coords:', newCoords);
                    if (!marker) {
                        popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML("<h1>Exact location will be provided after booking</h1>");
                        marker = new mapboxgl.Marker().setLngLat(newCoords).setPopup(popup).addTo(map);
                    } else {
                        marker.setLngLat(newCoords);
                    }
                    map.setCenter(newCoords);
                } else {
                    console.log('No features found');
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            }
        }
    });
}
