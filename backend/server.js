const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔥 TEMPORARY HOSPITAL DATA (we'll connect Firebase next)
const hospitals = [
  {
    name: "CityCare",
    distance: 4,
    traffic: 8,
    icu_beds: 5,
    general_beds: 10,
    doctors: 6,
    hospital_type: "private"
  },
  {
    name: "Govt Hospital",
    distance: 3,
    traffic: 6,
    icu_beds: 1,
    general_beds: 20,
    doctors: 4,
    hospital_type: "govt"
  }
];

// 🚑 MAIN API
app.post("/recommend", async (req, res) => {
  const userData = req.body;

  let bestHospital = null;
  let bestScore = Infinity;

  for (let h of hospitals) {

    const payload = {
      ...h,
      emergency_type: userData.emergency_type,
      age: userData.age
    };

    // 🔥 CALL YOUR AI API
    const aiRes = await axios.post("http://127.0.0.1:5000/ai", payload);
    const ai = aiRes.data;

    // 🧠 SCORING LOGIC
    let score =
      (h.distance * 0.4) +
      (h.traffic * 0.2) -
      (h.icu_beds * 0.2) -
      (h.doctors * 0.2);

    // AI boost
    if (ai.priority === "ICU") score -= 5;
    if (ai.tag === "Most Equipped") score -= 3;

    if (score < bestScore) {
      bestScore = score;
      bestHospital = {
        ...h,
        ai
      };
    }
  }

  res.json(bestHospital);
});

app.listen(3000, () => console.log("Backend running on port 3000"));