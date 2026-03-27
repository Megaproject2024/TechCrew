from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def ai_decision(data):
    severity = "LOW"
    if data["emergency_type"] == "heart_attack":
        severity = "HIGH"

    priority = "GENERAL"
    if severity == "HIGH":
        priority = "ICU"

    tag = "Balanced"
    if data["icu_beds"] > 3:
        tag = "Most Equipped"

    return {
        "severity": severity,
        "priority": priority,
        "tag": tag
    }

@app.route('/ai', methods=['POST'])
def ai():
    data = request.json
    result = ai_decision(data)
    return jsonify(result)

app.run(port=5000)