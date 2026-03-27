const express = require("express");
const cors = require("cors");
const axios = require("axios");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- FIREBASE SETUP ---------------- */

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hospitalrouter-2f8f7-default-rtdb.firebaseio.com"
});

const db = admin.database();

/* ---------------- ROOT CHECK ---------------- */

app.get("/", (req, res) => {
  res.send("🚀 Backend with Firebase is running!");
});

/* ---------------- FIND HOSPITAL API ---------------- */

app.post("/find-hospital", async (req, res) => {
  try {
    const { emergency_type, age } = req.body;

    // Get hospitals from Firebase
    const snapshot = await db.ref("hospitals").once("value");
    const hospitalsData = snapshot.val();

    if (!hospitalsData) {
      return res.json([]);
    }

    let hospitals = Object.values(hospitalsData);

    // Call AI for each hospital
    for (let hospital of hospitals) {
      try {
        const aiRes = await axios.post("http://127.0.0.1:5000/ai", {
          ...hospital,
          emergency_type,
          age
        });

        hospital.priority = aiRes.data.priority;
        hospital.severity = aiRes.data.severity;
      } catch (err) {
        console.log("AI Error:", err.message);
        hospital.priority = "LOW";
      }
    }

    // Sort hospitals (HIGH > MEDIUM > LOW)
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };

    hospitals.sort(
      (a, b) =>
        (priorityOrder[b.priority] || 0) -
        (priorityOrder[a.priority] || 0)
    );

    // Return top 3 hospitals
    res.json(hospitals.slice(0, 3));

  } catch (err) {
    console.log("Server Error:", err);
    res.status(500).send("Server Error");
  }
});

/* ---------------- START SERVER ---------------- */

app.listen(3000, () => {
  console.log("🚀 Backend running on http://127.0.0.1:3000");
});