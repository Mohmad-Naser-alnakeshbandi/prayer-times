// Leaflet-Karte (L kommt als globales Skript aus index.html).
import { MAP } from "../config.js";

let map = null;
let marker = null;

/** Erstellt die Karte und ruft onSelect(lat, lon) bei Klick auf. */
export function initMap(elementId, onSelect) {
  map = L.map(elementId, { worldCopyJump: true, zoomControl: false }).setView(MAP.center, MAP.zoom);
  // Zoom unten links, damit oben die Suchleiste frei bleibt
  L.control.zoom({ position: "bottomleft" }).addTo(map);

  // Leaflet misst seine Größe nur beim Start – bei jeder Größenänderung neu messen,
  // sonst fehlen Kacheln (z. B. nach Layout-Wechsel oder Drehen des Handys)
  const container = document.getElementById(elementId);
  new ResizeObserver(() => map.invalidateSize({ pan: false })).observe(container);
  L.tileLayer(MAP.tileUrl, { maxZoom: 19, attribution: MAP.attribution }).addTo(map);

  map.on("click", (event) => {
    // Bei mehrfach umlaufender Weltkarte Längengrad auf -180…180 normalisieren
    const { lat, lng } = event.latlng.wrap();
    onSelect(lat, lng);
  });
}

const pinIcon = () => L.divIcon({
  className: "pin",
  html: '<span class="pin-dot"></span>',
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

export function setMarker(lat, lon) {
  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lon], { icon: pinIcon(), keyboard: false }).addTo(map);
}

export function focusOn(lat, lon) {
  map.setView([lat, lon], MAP.locateZoom);
}
