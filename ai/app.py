from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def ai_decision(data):
    emergency = data.get("emergency_type", "accident")
    icu_beds   = data.get("icu_beds", 0)
    doctors    = data.get("doctors", 0)
    distance   = data.get("distance", 10)
    age        = data.get("age", 30)
    priority_input = data.get("priority", "Moderate")   # Critical / Urgent / Moderate
    hospital_type  = data.get("hospital_type", "private")  # govt / private

    # ── Severity ──────────────────────────────────────────────
    HIGH_EMERGENCIES   = {"heart_attack", "heart", "cardiac", "stroke"}
    MEDIUM_EMERGENCIES = {"accident", "respiratory", "breathing", "trauma"}

    if emergency in HIGH_EMERGENCIES or priority_input == "Critical":
        severity = "HIGH"
    elif emergency in MEDIUM_EMERGENCIES or priority_input == "Urgent":
        severity = "MEDIUM"
    else:
        severity = "LOW"

    # Age bump: elderly/children → escalate
    if age >= 70 or age <= 5:
        if severity == "LOW":    severity = "MEDIUM"
        elif severity == "MEDIUM": severity = "HIGH"

    # ── Priority ──────────────────────────────────────────────
    if severity == "HIGH":
        priority = "ICU"
    elif severity == "MEDIUM":
        priority = "EMERGENCY"
    else:
        priority = "GENERAL"

    # ── Tag ───────────────────────────────────────────────────
    if icu_beds >= 8 and doctors >= 10:
        tag = "Most Equipped"
    elif distance <= 2:
        tag = "Fastest"
    elif icu_beds >= 5:
        tag = "ICU Available"
    else:
        tag = "Balanced"

    # ── Score ─────────────────────────────────────────────────
    score = 0
    if severity == "HIGH":   score += 50
    elif severity == "MEDIUM": score += 25

    if priority == "ICU":      score += 30
    elif priority == "EMERGENCY": score += 15

    if tag == "Most Equipped": score += 20
    elif tag == "ICU Available": score += 12
    elif tag == "Fastest":     score += 8

    score += max(0, 10 - distance)
    score += min(icu_beds * 2, 20)
    score += min(doctors,  10)

    # Govt hospitals get a small bonus for accessibility
    if hospital_type == "govt":
        score += 5

    # ── Recommendation ────────────────────────────────────────
    if severity == "HIGH" and icu_beds < 2:
        recommendation = "⚠️ Low ICU — consider next option"
    elif distance > 8:
        recommendation = "Far — use only if best equipped"
    else:
        recommendation = "✅ Recommended"

    return {
        "severity":       severity,
        "priority":       priority,
        "tag":            tag,
        "score":          score,
        "recommendation": recommendation,
        "hospital_type":  hospital_type
    }


@app.route('/ai', methods=['POST'])
def ai():
    data   = request.json
    result = ai_decision(data)
    return jsonify(result)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model": "MediRoute AI v2.1"})


if __name__ == "__main__":
    app.run(port=5000, debug=True)