import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAB7KSKUn5HUh2Se-vpri-HGlxGsW9Y2-I",
  authDomain: "hospitalrouter-2f8f7.firebaseapp.com",
  databaseURL: "https://hospitalrouter-2f8f7-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let hospitals = [];
let map;
let markers = [];
let chart;

/* ================= MAP ================= */
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 18.5204, lng: 73.8567 },
    zoom: 12,
  });

  loadHospitals();
};

/* ================= LOAD DATA ================= */
function loadHospitals() {
  onValue(ref(db, "hospitals"), snap => {
    const data = snap.val() || {};
    hospitals = Object.values(data);

    renderMap();
    renderChart();
  });
}

/* ================= MAP MARKERS ================= */
function renderMap() {
  markers.forEach(m => m.setMap(null));
  markers = [];

  hospitals.forEach(h => {
    const marker = new google.maps.Marker({
      position: { lat: h.lat, lng: h.lng },
      map,
      title: h.name,
    });
    markers.push(marker);
  });
}

/* ================= FIND HOSPITAL ================= */
window.findHospital = function () {
  const lat = parseFloat(document.getElementById("lat").value);
  const lng = parseFloat(document.getElementById("lng").value);
  const severity = document.getElementById("severity").value;

  if (!lat || !lng) {
    alert("Enter location");
    return;
  }

  let best = null;
  let bestScore = Infinity;

  hospitals.forEach(h => {
    const distance = Math.sqrt(
      Math.pow(lat - h.lat, 2) + Math.pow(lng - h.lng, 2)
    );

    let score = distance;

    if (severity === "critical") {
      score -= h.icu_beds * 0.5;
    }

    if (score < bestScore) {
      bestScore = score;
      best = h;
    }
  });

  showResult(best);
};

/* ================= RESULT ================= */
function showResult(h) {
  const el = document.getElementById("results");

  el.innerHTML = `
    <div class="item">
      <div>
        <b>${h.name}</b><br>
        ICU: ${h.icu_beds} | Doctors: ${h.doctors}
      </div>
    </div>
  `;

  document.getElementById("eta").innerText =
    "ETA: " + (Math.random() * 10 + 2).toFixed(0) + " mins";
}

/* ================= CHART ================= */
function renderChart() {
  const ctx = document.getElementById("icuChart");

  const labels = hospitals.map(h => h.name);
  const data = hospitals.map(h => h.icu_beds);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "ICU Beds", data }]
    }
  });
}

/* ================= UI ================= */
window.toggleSidebar = () => {
  document.getElementById("sidebar").classList.toggle("active");
};

window.scrollToSection = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
};

window.logout = () => {
  signOut(auth);
  window.location = "index.html";
};