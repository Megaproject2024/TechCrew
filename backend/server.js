const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// MAIN ROUTE
app.post("/find-hospital", async (req, res) => {

    let hospitals = [
        { name: "CityCare", distance: 3, icu_beds: 5, doctors: 8, traffic: 3, lat:18.52,lng:73.85 },
        { name: "Apollo", distance: 6, icu_beds: 9, doctors: 10, traffic: 6, lat:18.53,lng:73.84 },
        { name: "Ruby Hall", distance: 2, icu_beds: 3, doctors: 6, traffic: 2, lat:18.51,lng:73.86 }
    ];

    try {
        // 🔥 CALL AI FOR EACH HOSPITAL
        for (let h of hospitals) {

            const aiRes = await axios.post("http://127.0.0.1:5000/ai", {
                emergency_type: req.body.emergency_type,
                age: req.body.age,
                distance: h.distance,
                icu_beds: h.icu_beds,
                doctors: h.doctors
            });

            h.ai = aiRes.data;

            // SCORING BASED ON AI
            let score = 0;

            if (h.ai.severity === "HIGH") score += 50;
            if (h.ai.priority === "ICU") score += 30;
            if (h.ai.tag === "Most Equipped") score += 20;

            score += (10 - h.distance);

            h.score = score;
        }

        // SORT
        hospitals.sort((a, b) => b.score - a.score);

        res.json(hospitals);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("AI Server Error");
    }
});

app.listen(3000, () => console.log("🚀 Backend running on 3000"));