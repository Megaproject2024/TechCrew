from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def ai_decision(data):
    severity = "LOW"

    if data.get("emergency_type") == "heart_attack":
        severity = "HIGH"
    elif data.get("emergency_type") == "accident":
        severity = "MEDIUM"

    priority = "GENERAL"
    if severity == "HIGH":
        priority = "ICU"

    tag = "Balanced"
    if data.get("icu_beds", 0) > 3:
        tag = "Most Equipped"
    elif data.get("distance", 10) < 3:
        tag = "Fastest"

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

if __name__ == "__main__":
    app.run(port=5000)