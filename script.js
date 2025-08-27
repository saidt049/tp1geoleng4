// Inicializar mapa
const map = L.map("map").setView([0, 0], 2);

// Capa de OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let marker;

// Mostrar estado
const statusDiv = document.getElementById("status");
function setStatus(msg) {
  statusDiv.innerText = msg;
}

// Botón: Obtener ubicación
document.getElementById("btnLocate").addEventListener("click", () => {
  if (!navigator.geolocation) {
    setStatus("Geolocalización no soportada en este navegador.");
    return;
  }

  setStatus("Obteniendo ubicación...");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = pos.coords.accuracy;

      setStatus("Ubicación obtenida ✔️");
      document.getElementById("lat").innerText = lat.toFixed(6);
      document.getElementById("lng").innerText = lng.toFixed(6);
      document.getElementById("acc").innerText = acc;

      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);
      map.setView([lat, lng], 15);
    },
    (err) => {
      setStatus("Error al obtener ubicación: " + err.message);
    }
  );
});

// Botón: Copiar coordenadas
document.getElementById("btnCopy").addEventListener("click", () => {
  const lat = document.getElementById("lat").innerText;
  const lng = document.getElementById("lng").innerText;
  if (lat === "—" || lng === "—") {
    setStatus("No hay coordenadas para copiar.");
    return;
  }
  navigator.clipboard.writeText(`${lat}, ${lng}`);
  setStatus("Coordenadas copiadas 📋");
});

// Botón: Limpiar marcador
document.getElementById("btnClear").addEventListener("click", () => {
  if (marker) {
    map.removeLayer(marker);
    marker = null;
    setStatus("Marcador eliminado.");
  }
});

// Click manual en el mapa para poner marcador
map.on("click", (e) => {
  if (marker) map.removeLayer(marker);
  marker = L.marker(e.latlng).addTo(map);

  document.getElementById("lat").innerText = e.latlng.lat.toFixed(6);
  document.getElementById("lng").innerText = e.latlng.lng.toFixed(6);
  document.getElementById("acc").innerText = "manual";
  setStatus("Marcador colocado manualmente.");
});
