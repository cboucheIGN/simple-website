// create map center on france

const map = L.map('map').setView([47.29, 2.77], 5);

// add orthophotos layer

L.tileLayer(
  "https://data.geopf.fr/wmts?" +
  "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
  "&STYLE=normal" +
  "&TILEMATRIXSET=PM" +
  "&FORMAT=image/jpeg" +
  "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS" +
  "&TILEMATRIX={z}" +
  "&TILEROW={y}" +
  "&TILECOL={x}",
  {
    minZoom: 0,
    maxZoom: 18,
    attribution: "IGN-F/Geoportail",
    tileSize: 256 // les tuiles du Géooportail font 256x256px
  }
).addTo(map);

// load geojson data
// L.geoJSON(GEOPHOTO_DATA).addTo(map);
let photos = [];
let positions = [];
L.geoJSON(GEOPHOTO_DATA, {
  onEachFeature: (feature) => {
    const photo = feature.properties.photo;
    const position = feature.geometry.coordinates;
    if (photo && position) {

      photos.push(photo);

      positions.push([
        position[1],
        position[0]
      ]);

    }
  }
});

// console.log(photos, positions);


map.on('click', (event) => {
  // solution
  const pointClicked = [event.latlng.lat, event.latlng.lng];
  console.log(selectedPosition, pointClicked, event);
  L.circle(pointClicked, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
  }).addTo(map);
  L.marker(selectedPosition).addTo(map);
  const line = L.polyline([pointClicked, selectedPosition], {
    color: 'red',
  }).addTo(map);
  map.fitBounds(line.getBounds());

  // compute point

  // refresh image
  newTirage();
});



let tirage, selectedPhoto, selectedPosition;

function newTirage() {
  tirage = Math.random() * (photos.length - 1)
  tirage = Math.round(tirage);

  selectedPhoto = photos[tirage];

  selectedPosition = positions[tirage];

  console.log('newTirage', selectedPhoto, selectedPosition);

  // add photo
  const image = document.createElement('img');
  image.src = selectedPhoto;
  image.classList.add('photo-choisie');
  const allImages = document.getElementById('photos');
  allImages.insertBefore(image, allImages.firstChild);
}

newTirage();
