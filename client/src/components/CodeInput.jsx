function CodeInput({ code, setCode, onAnalyze, loading }) {
  return (
    <div className="code-input-section">
      <div className="section-header">
        <div className="header-icon">📝</div>
        <h2>Paste your code</h2>
        <span className="char-count">{code.length} chars</span>
      </div>
      
      <div className="textarea-wrapper">
        <textarea
          className="code-textarea"
          rows="12"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Paste your JavaScript/Python code here...
// Cody will analyze loops, recursion depth, and suggest improvements

function example() {
  for (let i = 0; i < 10; i++) {
    console.log(i);
  }
}"
          spellCheck="false"
        />
        <div className="code-badge">
          <span>JS • PY • TS • JAVA</span>
        </div>
      </div>

      <button 
        className={`analyze-btn ${loading ? 'loading' : ''}`}
        onClick={onAnalyze}
        disabled={loading || !code.trim()}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Cody is thinking...
          </>
        ) : (
          <>
            <span className="btn-icon">🔍</span>
            Analyze with Cody
          </>
        )}
      </button>
    </div>
  );
}

export default CodeInput;