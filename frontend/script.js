const auth = firebase.auth();
const db = firebase.database();

let map, userMarker, directionsService, directionsRenderer;

/* ---------------- MAP INIT ---------------- */

function initMap() {
  const defaultLocation = { lat: 18.5204, lng: 73.8567 }; // Pune

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: defaultLocation,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // User marker
  userMarker = new google.maps.Marker({
    position: defaultLocation,
    map,
    title: "You",
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  });
}

/* ---------------- FIND HOSPITAL ---------------- */

async function findHospital() {
  document.getElementById("result").innerHTML =
    "<p class='loading'>🤖 AI thinking...</p>";

  const response = await fetch("http://127.0.0.1:3000/find-hospital", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      emergency_type: document.getElementById("emergency").value,
      age: document.getElementById("age").value
    })
  });

  const hospitals = await response.json();

  showHospitals(hospitals);
  showMapHospitals(hospitals);
}

/* ---------------- SHOW CARDS ---------------- */

function showHospitals(hospitals) {
  let html = `<div class="cards">`;

  hospitals.forEach(h => {
    html += `
      <div class="card">
        <h3>🏥 ${h.name}</h3>
        <p>📍 ${h.distance} km</p>
        <p>🛏 ICU: ${h.icu_beds}</p>
        <p>👨‍⚕ ${h.doctors}</p>
        <p>⚡ ${h.priority}</p>
      </div>
    `;
  });

  html += `</div>`;
  document.getElementById("result").innerHTML = html;
}

/* ---------------- MAP HOSPITALS ---------------- */

function showMapHospitals(hospitals) {
  hospitals.forEach((h, index) => {
    const location = {
      lat: 18.52 + (Math.random() - 0.5) * 0.05,
      lng: 73.85 + (Math.random() - 0.5) * 0.05
    };

    const marker = new google.maps.Marker({
      position: location,
      map,
      title: h.name,
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    });

    // First hospital = best → show route
    if (index === 0) {
      drawRoute(userMarker.getPosition(), location);
      startAmbulance(userMarker.getPosition(), location);
    }
  });
}

/* ---------------- DRAW ROUTE ---------------- */

function drawRoute(origin, destination) {
  directionsService.route({
    origin,
    destination,
    travelMode: "DRIVING"
  }, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    }
  });
}

/* ---------------- AMBULANCE SIMULATION ---------------- */

function startAmbulance(start, end) {
  const ambulance = new google.maps.Marker({
    position: start,
    map,
    icon: "https://maps.google.com/mapfiles/kml/shapes/ambulance.png"
  });

  let progress = 0;

  const interval = setInterval(() => {
    progress += 0.02;

    const lat = start.lat() + (end.lat - start.lat()) * progress;
    const lng = start.lng() + (end.lng - start.lng()) * progress;

    ambulance.setPosition({ lat, lng });

    if (progress >= 1) clearInterval(interval);
  }, 200);
}