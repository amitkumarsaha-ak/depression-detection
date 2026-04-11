from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import requests

# ===== Flask setup =====
app = Flask(__name__)
CORS(app)

# ===== LR MODEL (fallback) =====
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.route("/")
def home():
    return "API is running 🚀"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data["text"]

    try:
        print("👉 Calling BiLSTM API...")

        response = requests.post(
            "https://education-image-slashed.ngrok-free.dev/predict",
            json={"text": text},
            timeout=10,
            verify=False
        )

        print("👉 Status:", response.status_code)
        print("👉 Response:", response.text)

        result = response.json()

        confidence = float(result["confidence"])
        prediction = int(result["prediction"])

        # 🔥 Low confidence fallback
        if confidence < 10:
            print("⚠️ Low confidence → using LR")

            vector = vectorizer.transform([text])
            pred = model.predict(vector)[0]
            conf = max(model.predict_proba(vector)[0])

            return jsonify({
                "prediction": int(pred),
                "confidence": round(conf * 100, 2)
            })

        return jsonify({
            "prediction": prediction,
            "confidence": round(confidence, 2)
        })

    except Exception as e:
        print("❌ ERROR:", e)
        print("👉 Using LR fallback")

        vector = vectorizer.transform([text])
        pred = model.predict(vector)[0]
        conf = max(model.predict_proba(vector)[0])

        return jsonify({
            "prediction": int(pred),
            "confidence": round(conf * 100, 2)
        })

if __name__ == "__main__":
    app.run(debug=True)