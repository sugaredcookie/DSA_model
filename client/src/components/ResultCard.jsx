import Suggestions from "./Suggestions";

function ResultCard({ result }) {
  const getComplexityColor = (depth) => {
    if (depth <= 2) return 'success';
    if (depth <= 4) return 'warning';
    return 'error';
  };

  return (
    <div className="result-section">
      <div className="section-header">
        <div className="header-icon">📊</div>
        <h2>Cody's Analysis</h2>
        <span className="analysis-badge">Real-time</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <span className="stat-label">Loop Count</span>
            <span className="stat-value">{result.analysis?.loops || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Max Depth</span>
            <span className={`stat-value depth-${getComplexityColor(result.analysis?.maxDepth)}`}>
              {result.analysis?.maxDepth || 0}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <span className="stat-label">Recursion</span>
            <span className={`stat-value ${result.analysis?.recursion ? 'recursion-true' : 'recursion-false'}`}>
              {result.analysis?.recursion ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {result.mlPrediction && (
        <div className="ml-prediction-card">
          <div className="ml-header">
            <span className="ml-icon">🤖</span>
            <h3>Complexity Prediction</h3>
          </div>
          <div className="ml-content">
            <span className="complexity-badge">{result.mlPrediction}</span>
            <p className="ml-description">
              Cody's AI model predicts this complexity based on your code structure
            </p>
          </div>
        </div>
      )}

      <Suggestions suggestions={result.suggestions || []} />

      <details className="raw-data-toggle">
        <summary>🔧 View raw analysis data</summary>
        <pre className="raw-json">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default ResultCard;