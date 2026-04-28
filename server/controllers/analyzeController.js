const { analyzeCode } = require("../services/analyzer");
const { getSuggestions } = require("../services/recommender");
const { getMLPrediction } = require("../services/mlService");

const analyzeController = async (req, res) => {
  try {
    const { code } = req.body;
    console.log("REQ BODY:", req.body);

    // Validate input
    if (!code || typeof code !== "string") {
      return res.status(400).json({
        error: "Code is required and must be a string"
      });
    }

    // Step 1: Analyze code
    const analysis = analyzeCode(code);

    console.log("Analysis:", analysis);

    // Step 2: Call ML (Flask)
    const mlPrediction = await getMLPrediction(analysis);

    console.log("ML Prediction:", mlPrediction);

    // Step 3: Get suggestions
    const suggestions = getSuggestions(analysis);

    // Step 4: Send response
    return res.json({
      analysis,
      mlPrediction,
      suggestions
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

module.exports = { analyzeController };