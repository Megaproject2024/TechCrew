// ─────────────────────────────────────────────────────────────
const express = require("express");
const cors    = require("cors");
const axios   = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────
//  POST /find-hospital
//  Body: { emergency_type, age, priority }
//  Returns: sorted array split into { govt: [...], private: [...], all: [...] }
// ─────────────────────────────────────────────────────────────
app.post("/find-hospital", async (req, res) => {

    // Static hospital list – in production these come from Firebase/DB
    // hospital_type field: "govt" | "private"
    let hospitals = [
        { name: "CityCare Hospital",    distance: 3,  icu_beds: 5,  doctors: 8,  traffic: 3, lat: 18.52, lng: 73.85, hospital_type: "private" },
        { name: "Apollo Medical",       distance: 6,  icu_beds: 9,  doctors: 12, traffic: 6, lat: 18.53, lng: 73.84, hospital_type: "private" },
        { name: "Ruby Hall Clinic",     distance: 2,  icu_beds: 3,  doctors: 6,  traffic: 2, lat: 18.51, lng: 73.86, hospital_type: "private" },
        { name: "Sassoon General",      distance: 4,  icu_beds: 12, doctors: 20, traffic: 5, lat: 18.515, lng: 73.855, hospital_type: "govt"    },
        { name: "KEM Hospital",         distance: 7,  icu_beds: 15, doctors: 25, traffic: 7, lat: 18.535, lng: 73.875, hospital_type: "govt"    },
        { name: "District Civil Hosp.", distance: 5,  icu_beds: 8,  doctors: 14, traffic: 4, lat: 18.525, lng: 73.840, hospital_type: "govt"    }
    ];

    try {
        // Call AI for each hospital
        for (let h of hospitals) {
            const aiRes = await axios.post("http://127.0.0.1:5000/ai", {
                emergency_type: req.body.emergency_type,
                age:            req.body.age           || 30,
                priority:       req.body.priority      || "Moderate",
                distance:       h.distance,
                icu_beds:       h.icu_beds,
                doctors:        h.doctors,
                hospital_type:  h.hospital_type
            });

            h.ai    = aiRes.data;
            h.score = aiRes.data.score;
        }

        // Sort by score descending
        hospitals.sort((a, b) => b.score - a.score);

        // Split by category
        const govt    = hospitals.filter(h => h.hospital_type === "govt");
        const priv    = hospitals.filter(h => h.hospital_type === "private");

        res.json({ all: hospitals, govt, private: priv });

    } catch (err) {
        console.error("AI Server Error:", err.message);
        res.status(500).json({ error: "AI Server Error", message: err.message });
    }
});

app.listen(3000, () => console.log("🚀 MediRoute Backend running on http://localhost:3000"));