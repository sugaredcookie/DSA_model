from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

#lets load the model here
model = joblib.load('models/rf_model.pkl')

#health check
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Algorithm Analyzer ML API is running"
    })

@app.route('/predict', methods=["POST"])
def predict():
    try:
        data = request.json

        loops = data.get("loops")
        maxDepth = data.get("maxDepth")
        recursion = int(data.get("recursion"))

        prediction = model.predict([[loops, maxDepth, recursion]])

        return jsonify({
            "prediction": prediction[0]
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(port=8000, debug=True)