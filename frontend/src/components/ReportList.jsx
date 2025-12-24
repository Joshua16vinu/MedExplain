import { useState, useEffect } from "react";
import { getReports } from "../services/api";
import "./ReportList.css";

export default function ReportList({ user, onReportSelect, selectedReport }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReports();
  }, [user]);

  async function loadReports() {
    try {
      setLoading(true);
      setError(null);
      const data = await getReports(user);
      setReports(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <div className="report-list-container">
        <div className="loading-state">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-list-container">
        <div className="error-state">
          <p>Failed to load reports: {error}</p>
          <button className="retry-btn" onClick={loadReports}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="report-list-container">
        <div className="empty-state">
          <p>No reports found. Upload your first report to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-list-container">
      <div className="report-list-header">
        <h3>Your Reports</h3>
        <button className="refresh-btn" onClick={loadReports} title="Refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>

      <div className="report-list">
        {reports.map((report, index) => {
          const isSelected =
            selectedReport &&
            selectedReport.reportName === report.reportName &&
            selectedReport.reportType === report.reportType;

          return (
            <div
              key={index}
              className={`report-item ${isSelected ? "selected" : ""}`}
              onClick={() => onReportSelect(report)}
            >
              <div className="report-item-content">
                <div className="report-item-header">
                  <span className="report-name">{report.reportName}</span>
                  <span className="report-type">{report.reportType}</span>
                </div>
                <div className="report-item-meta">
                  <span className="report-date">{formatDate(report.createdAt)}</span>
                </div>
              </div>
              {isSelected && (
                <div className="selected-indicator">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

