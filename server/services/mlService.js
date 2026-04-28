const axios = require("axios");

const getMLPrediction = async (analysis) => {
  try {
    const res = await axios.post("http://localhost:8000/predict", {
      loops: analysis.loops,
      maxDepth: analysis.maxDepth,
      recursion: analysis.recursion ? 1 : 0
    });

    return res.data.prediction;
  } catch (err) {
    console.error("ML Service Error:", err.message);
    return null;
  }
};

module.exports = { getMLPrediction };