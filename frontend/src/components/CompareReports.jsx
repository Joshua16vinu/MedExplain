import { useState } from "react";
import { compareReports } from "../services/api";
import ReportList from "./ReportList";
import ComparisonView from "./ComparisonView";
import "./CompareReports.css";

export default function CompareReports({ user }) {
  const [oldReport, setOldReport] = useState(null);
  const [newReport, setNewReport] = useState(null);
  const [comparisonFile, setComparisonFile] = useState(null);
  const [comparisonMethod, setComparisonMethod] = useState("existing"); // "existing" or "upload"
  const [newReportType, setNewReportType] = useState(""); // Report type for new upload
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    if (!oldReport) {
      setError("Please select an old report");
      return;
    }

    if (comparisonMethod === "upload") {
      if (!comparisonFile || !newReportType) {
        setError("Please upload a new report file and select its type");
        return;
      }
    } else {
      if (!newReport) {
        setError("Please select a new report");
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      setComparison(null);

      const params = {
        oldReportName: oldReport.reportName,
        oldReportType: oldReport.reportType,
        language: "en",
      };

      if (comparisonMethod === "upload") {
        params.file = comparisonFile;
        params.newReportType = newReportType;
      } else {
        params.newReportName = newReport.reportName;
        params.newReportType = newReport.reportType;
      }

      const result = await compareReports(params, user);
      setComparison(result.comparison);
      
      // Update newReport if file was uploaded
      if (comparisonMethod === "upload" && result.reportId) {
        setNewReport({
          reportName: comparisonFile.name.replace(/\.[^/.]+$/, ""),
          reportType: newReportType,
        });
      }
    } catch (err) {
      setError(err.message);
      console.error("Comparison failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetComparison = () => {
    setOldReport(null);
    setNewReport(null);
    setComparisonFile(null);
    setComparison(null);
    setError(null);
  };

  return (
    <div className="compare-reports-container">
      <div className="compare-reports-header">
        <h2>Compare Reports</h2>
        <p className="subtitle">
          Select two reports to see how your health metrics have changed over time
        </p>
      </div>

      <div className="compare-reports-content">
        {/* Old Report Selection */}
        <div className="compare-section">
          <h3>1. Select Old Report</h3>
          <ReportList
            user={user}
            onReportSelect={setOldReport}
            selectedReport={oldReport}
          />
        </div>

        {/* Comparison Type Selection */}
        {oldReport && (
          <div className="compare-section">
            <h3>2. Choose Comparison Method</h3>
            <div className="comparison-type-selector">
              <label className="type-option">
                <input
                  type="radio"
                  name="comparisonMethod"
                  value="existing"
                  checked={comparisonMethod === "existing"}
                  onChange={(e) => {
                    setComparisonMethod(e.target.value);
                    setNewReport(null);
                    setComparisonFile(null);
                    setNewReportType("");
                  }}
                />
                <span>Compare with existing report</span>
              </label>
              <label className="type-option">
                <input
                  type="radio"
                  name="comparisonMethod"
                  value="upload"
                  checked={comparisonMethod === "upload"}
                  onChange={(e) => {
                    setComparisonMethod(e.target.value);
                    setNewReport(null);
                  }}
                />
                <span>Upload new report to compare</span>
              </label>
            </div>
          </div>
        )}

        {/* New Report Selection or Upload */}
        {oldReport && comparisonMethod === "existing" && (
          <div className="compare-section">
            <h3>3. Select New Report</h3>
            <ReportList
              user={user}
              onReportSelect={setNewReport}
              selectedReport={newReport}
            />
          </div>
        )}

        {oldReport && comparisonMethod === "upload" && (
          <div className="compare-section">
            <h3>3. Upload New Report</h3>
            <div className="file-upload-wrapper">
              <input
                id="comparison-file-input"
                type="file"
                accept=".pdf"
                onChange={(e) => setComparisonFile(e.target.files[0])}
                className="file-input-hidden"
              />
              <label htmlFor="comparison-file-input" className="file-input-label">
                <svg className="file-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span className="file-input-text">
                  {comparisonFile ? comparisonFile.name : "Choose PDF File"}
                </span>
              </label>
              {comparisonFile && (
                <div className="file-selected-indicator">
                  ✓ File selected
                </div>
              )}
            </div>

            <div className="report-type-selector">
              <label>
                Report Type:
                <select
                  value={newReportType}
                  onChange={(e) => setNewReportType(e.target.value)}
                  className="type-select"
                >
                  <option value="">Select type...</option>
                  <option value="CBC">CBC (Complete Blood Count)</option>
                  <option value="LIPID">Lipid Profile</option>
                  <option value="LFT">LFT (Liver Function Test)</option>
                  <option value="KFT">KFT (Kidney Function Test)</option>
                  <option value="THYROID">Thyroid Function Test</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {/* Compare Button */}
        {oldReport && ((comparisonMethod === "existing" && newReport) || (comparisonMethod === "upload" && comparisonFile && newReportType)) && (
          <div className="compare-actions">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <button
              className="compare-btn"
              onClick={handleCompare}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Comparing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Compare Reports
                </>
              )}
            </button>
            {comparison && (
              <button className="reset-btn" onClick={resetComparison}>
                Compare Another
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comparison Result */}
      {comparison && (
        <ComparisonView
          comparison={comparison}
          oldReport={oldReport}
          newReport={newReport}
        />
      )}
    </div>
  );
}

