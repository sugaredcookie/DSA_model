import { useState } from "react";
import { analyzeCode } from "./services/api";
import CodeInput from "./components/CodeInput";
import ResultCard from "./components/ResultCard";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const res = await analyzeCode(code);
      console.log("API RESPONSE:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Backend error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="hero-section">
        <div className="cody-badge">
          <span className="cody-icon">🐺</span>
          <span className="cody-text">Cody AI</span>
        </div>
        <h1>
          Algorithm <span className="gradient-text">Analyzer</span>
        </h1>
        <p className="subtitle">
          Let Cody analyze your code structure, detect complexity issues, 
          and provide intelligent optimization suggestions
        </p>
      </div>

      <CodeInput
        code={code}
        setCode={setCode}
        onAnalyze={handleAnalyze}
        loading={loading}
      />

      {result && <ResultCard result={result} />}
    </div>
  );
}

export default App;