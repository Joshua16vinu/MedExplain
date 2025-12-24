import ReactMarkdown from "react-markdown";
import "./ComparisonView.css";

export default function ComparisonView({ comparison, oldReport, newReport }) {
  if (!comparison) {
    return null;
  }

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h2>Report Comparison</h2>
        {oldReport && newReport && (
          <div className="comparison-meta">
            <div className="comparison-report">
              <span className="comparison-label">Old:</span>
              <span className="comparison-value">
                {oldReport.reportName} ({oldReport.reportType})
              </span>
            </div>
            <div className="comparison-arrow">→</div>
            <div className="comparison-report">
              <span className="comparison-label">New:</span>
              <span className="comparison-value">
                {newReport.reportName} ({newReport.reportType})
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="comparison-card">
        <ReactMarkdown>{comparison}</ReactMarkdown>
      </div>
    </div>
  );
}

