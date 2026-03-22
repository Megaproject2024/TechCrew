from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# -------- AI LOGIC --------

def get_severity(emergency_type, age):
    if emergency_type == "heart_attack":
        return "HIGH"
    elif emergency_type == "accident" and age > 50:
        return "HIGH"
    elif emergency_type == "pregnancy":
        return "MEDIUM"
    else:
        return "LOW"


def get_priority(severity):
    if severity == "HIGH":
        return "ICU"
    elif severity == "MEDIUM":
        return "GENERAL"
    else:
        return "BASIC"


def get_tag(distance, traffic, icu_beds, doctors, hospital_type):
    if icu_beds > 3 and doctors > 3:
        return "Most Equipped"
    elif distance < 5 and traffic < 10:
        return "Fastest"
    elif hospital_type == "govt":
        return "Budget Friendly"
    else:
        return "Balanced"


def ai_decision(data):
    severity = get_severity(data.get("emergency_type"), data.get("age"))
    priority = get_priority(severity)
    tag = get_tag(
        data.get("distance"),
        data.get("traffic"),
        data.get("icu_beds"),
        data.get("doctors"),
        data.get("hospital_type")
    )

    return {
        "severity": severity,
        "priority": priority,
        "tag": tag
    }

# -------- ROUTES --------

# Home route (for testing)
@app.route('/')
def home():
    return "🚑 AI Server Running Successfully!"

# AI API
@app.route('/ai', methods=['POST'])
def ai():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        result = ai_decision(data)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------- RUN SERVER --------

if __name__ == '__main__':
    app.run(debug=True)