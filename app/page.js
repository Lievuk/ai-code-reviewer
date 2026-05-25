"use client"
import { useState } from "react"

function analyzeText(text) {
  const lines = text.split('\n');
  const codeLines = lines.filter(l => l.trim().length > 0);
  const commentLines = lines.filter(l => l.trim().startsWith('//') || l.trim().startsWith('#') || l.trim().startsWith('/*') || l.trim().startsWith('*'));
  const blankLines = lines.filter(l => l.trim().length === 0);
  const totalChars = text.length;
  const avgLineLen = codeLines.length > 0 ? Math.round(totalChars / codeLines.length) : 0;
  const longLines = codeLines.filter(l => l.length > 80).length;
  
  const issues = [];
  if (commentLines.length / codeLines.length < 0.05 && codeLines.length > 10) issues.push('Low comment ratio &mdash; add more documentation');
  if (longLines > 0) issues.push(longLines + ' lines exceed 80 chars &mdash; consider breaking them up');
  if (blankLines.length / lines.length > 0.3) issues.push('High blank line ratio &mdash; consider condensing');
  if (avgLineLen > 60) issues.push('Average line length is high (' + avgLineLen + ' chars) &mdash; improve readability');
  if (codeLines.length > 200) issues.push('File is long (' + codeLines.length + ' lines) &mdash; consider splitting into modules');
  
  return {
    original: text,
    summary: '<strong>Code Review Report</strong><br/>' + (issues.length > 0 ? issues.map((x, i) => (i+1) + '. ' + x).join('<br/>') : '&check; No major issues found! Code looks clean.'),
    originalLen: lines.length,
    summaryLen: codeLines.length,
    compression: Math.round((1 - issues.length / Math.max(codeLines.length, 1)) * 100)
  };
}

export default function Home() {
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = () => {
    if (!text.trim()) return
    setLoading(true)
    setTimeout(() => {
      try {
        const res = analyzeText(text)
        setResult(res)
      } catch(e) {
        setResult({ summary: "Error: " + e.message })
      }
      setLoading(false)
    }, 500)
  }

  return (
    <>
      <div className="card">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your source code here to analyze..."
        />
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button className="btn" onClick={handleAnalyze} disabled={loading || !text.trim()}>
            {loading ? "Analyzing..." : "Review Code"}
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>Review Results</h2>
          <div className="result" dangerouslySetInnerHTML={{ __html: result.summary }} />
          <p style={{ color: "#888", marginTop: "1rem", fontSize: "0.85rem" }}>
            Total: {result.originalLen} lines &rarr; Code: {result.summaryLen} lines
          </p>
        </div>
      )}
    </>
  )
}