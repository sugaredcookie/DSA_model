function Suggestions({ suggestions }) {
  if (!suggestions.length) {
    return (
      <div className="suggestions-empty">
        <span className="empty-icon">💡</span>
        <p>No optimization suggestions yet. Try adding more complex code!</p>
      </div>
    );
  }

  return (
    <div className="suggestions-section">
      <div className="suggestions-header">
        <span className="suggestions-icon">✨</span>
        <h3>Cody's Suggestions</h3>
        <span className="suggestion-count">{suggestions.length} tips</span>
      </div>
      <div className="suggestions-list">
        {suggestions.map((s, i) => (
          <div key={i} className="suggestion-item">
            <span className="suggestion-bullet">{i + 1}</span>
            <span className="suggestion-text">{s}</span>
            <button className="suggestion-action" title="Apply suggestion">Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suggestions;