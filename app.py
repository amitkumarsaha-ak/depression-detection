from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import requests
import os

app = Flask(__name__)
CORS(app)

model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.route("/")
def serve_index():
    return send_from_directory(".", "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(".", path)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")

    try:
        print("Calling BiLSTM API...")

        response = requests.post(
            "https://education-image-slashed.ngrok-free.dev/predict",
            json={"text": text},
            timeout=10,
            verify=False
        )

        result = response.json()

        confidence = float(result.get("confidence", 0))
        prediction = int(result.get("prediction", 0))

        if confidence < 10:
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
        print("ERROR:", e)

        vector = vectorizer.transform([text])
        pred = model.predict(vector)[0]
        conf = max(model.predict_proba(vector)[0])

        return jsonify({
            "prediction": int(pred),
            "confidence": round(conf * 100, 2)
        })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)