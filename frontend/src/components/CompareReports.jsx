// import { useState } from "react";
// import { compareReports } from "../services/api";
// import ReportList from "./ReportList";
// import ComparisonView from "./ComparisonView";
// import "./CompareReports.css";

// export default function CompareReports({ user }) {
//   const [oldReport, setOldReport] = useState(null);
//   const [newReport, setNewReport] = useState(null);
//   const [comparisonFile, setComparisonFile] = useState(null);
//   const [comparisonMethod, setComparisonMethod] = useState("existing"); // "existing" or "upload"
//   const [newReportType, setNewReportType] = useState(""); // Report type for new upload
//   const [loading, setLoading] = useState(false);
//   const [comparison, setComparison] = useState(null);
//   const [error, setError] = useState(null);

//   const handleCompare = async () => {
//     if (!oldReport) {
//       setError("Please select an old report");
//       return;
//     }

//     if (comparisonMethod === "upload") {
//       if (!comparisonFile || !newReportType) {
//         setError("Please upload a new report file and select its type");
//         return;
//       }
//     } else {
//       if (!newReport) {
//         setError("Please select a new report");
//         return;
//       }
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       setComparison(null);

//       const params = {
//         oldReportName: oldReport.reportName,
//         oldReportType: oldReport.reportType,
//         language: "en",
//       };

//       if (comparisonMethod === "upload") {
//         params.file = comparisonFile;
//         params.newReportType = newReportType;
//       } else {
//         params.newReportName = newReport.reportName;
//         params.newReportType = newReport.reportType;
//       }

//       const result = await compareReports(params, user);
//       setComparison(result.comparison);
      
//       // Update newReport if file was uploaded
//       if (comparisonMethod === "upload" && result.reportId) {
//         setNewReport({
//           reportName: comparisonFile.name.replace(/\.[^/.]+$/, ""),
//           reportType: newReportType,
//         });
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Comparison failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetComparison = () => {
//     setOldReport(null);
//     setNewReport(null);
//     setComparisonFile(null);
//     setComparison(null);
//     setError(null);
//   };

//   return (
//     <div className="compare-reports-container">
//       <div className="compare-reports-header">
//         <h2>Compare Reports</h2>
//         <p className="subtitle">
//           Select two reports to see how your health metrics have changed over time
//         </p>
//       </div>

//       <div className="compare-reports-content">
//         {/* Old Report Selection */}
//         <div className="compare-section">
//           <h3>1. Select Old Report</h3>
//           <ReportList
//             user={user}
//             onReportSelect={setOldReport}
//             selectedReport={oldReport}
//           />
//         </div>

//         {/* Comparison Type Selection */}
//         {oldReport && (
//           <div className="compare-section">
//             <h3>2. Choose Comparison Method</h3>
//             <div className="comparison-type-selector">
//               <label className="type-option">
//                 <input
//                   type="radio"
//                   name="comparisonMethod"
//                   value="existing"
//                   checked={comparisonMethod === "existing"}
//                   onChange={(e) => {
//                     setComparisonMethod(e.target.value);
//                     setNewReport(null);
//                     setComparisonFile(null);
//                     setNewReportType("");
//                   }}
//                 />
//                 <span>Compare with existing report</span>
//               </label>
//               <label className="type-option">
//                 <input
//                   type="radio"
//                   name="comparisonMethod"
//                   value="upload"
//                   checked={comparisonMethod === "upload"}
//                   onChange={(e) => {
//                     setComparisonMethod(e.target.value);
//                     setNewReport(null);
//                   }}
//                 />
//                 <span>Upload new report to compare</span>
//               </label>
//             </div>
//           </div>
//         )}

//         {/* New Report Selection or Upload */}
//         {oldReport && comparisonMethod === "existing" && (
//           <div className="compare-section">
//             <h3>3. Select New Report</h3>
//             <ReportList
//               user={user}
//               onReportSelect={setNewReport}
//               selectedReport={newReport}
//             />
//           </div>
//         )}

//         {oldReport && comparisonMethod === "upload" && (
//           <div className="compare-section">
//             <h3>3. Upload New Report</h3>
//             <div className="file-upload-wrapper">
//               <input
//                 id="comparison-file-input"
//                 type="file"
//                 accept=".pdf"
//                 onChange={(e) => setComparisonFile(e.target.files[0])}
//                 className="file-input-hidden"
//               />
//               <label htmlFor="comparison-file-input" className="file-input-label">
//                 <svg className="file-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                   <polyline points="17 8 12 3 7 8"></polyline>
//                   <line x1="12" y1="3" x2="12" y2="15"></line>
//                 </svg>
//                 <span className="file-input-text">
//                   {comparisonFile ? comparisonFile.name : "Choose PDF File"}
//                 </span>
//               </label>
//               {comparisonFile && (
//                 <div className="file-selected-indicator">
//                   ✓ File selected
//                 </div>
//               )}
//             </div>

//             <div className="report-type-selector">
//               <label>
//                 Report Type:
//                 <select
//                   value={newReportType}
//                   onChange={(e) => setNewReportType(e.target.value)}
//                   className="type-select"
//                 >
//                   <option value="">Select type...</option>
//                   <option value="CBC">CBC (Complete Blood Count)</option>
//                   <option value="LIPID">Lipid Profile</option>
//                   <option value="LFT">LFT (Liver Function Test)</option>
//                   <option value="KFT">KFT (Kidney Function Test)</option>
//                   <option value="THYROID">Thyroid Function Test</option>
//                   <option value="OTHER">Other</option>
//                 </select>
//               </label>
//             </div>
//           </div>
//         )}

//         {/* Compare Button */}
//         {oldReport && ((comparisonMethod === "existing" && newReport) || (comparisonMethod === "upload" && comparisonFile && newReportType)) && (
//           <div className="compare-actions">
//             {error && (
//               <div className="error-message">
//                 {error}
//               </div>
//             )}
//             <button
//               className="compare-btn"
//               onClick={handleCompare}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="loading-spinner"></span>
//                   Comparing...
//                 </>
//               ) : (
//                 <>
//                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                     <polyline points="17 8 12 3 7 8"></polyline>
//                     <line x1="12" y1="3" x2="12" y2="15"></line>
//                   </svg>
//                   Compare Reports
//                 </>
//               )}
//             </button>
//             {comparison && (
//               <button className="reset-btn" onClick={resetComparison}>
//                 Compare Another
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Comparison Result */}
//       {comparison && (
//         <ComparisonView
//           comparison={comparison}
//           oldReport={oldReport}
//           newReport={newReport}
//         />
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getReports, compareReports } from "../services/api";
import "./CompareReports.css";

export default function CompareReports({ user }) {
  const [reports, setReports] = useState([]);
  const [oldReport, setOldReport] = useState(null);
  const [newReport, setNewReport] = useState(null);
  const [comparison, setComparison] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReports();
  }, [user]);

  async function loadReports() {
    try {
      const data = await getReports(user);
      setReports(data || []);
    } catch (err) {
      console.error("Failed to load reports:", err);
    }
  }

  // async function handleCompare() {
  //   if (!oldReport || !newReport) {
  //     setError("Please select both reports to compare");
  //     return;
  //   }

  //   if (oldReport.reportName === newReport.reportName && 
  //       oldReport.reportType === newReport.reportType) {
  //     setError("Please select two different reports");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const result = await compareReports(
  //       oldReport.reportName,
  //       oldReport.reportType,
  //       newReport.reportName,
  //       newReport.reportType,
  //       user
  //     );
  //     setComparison(result.comparison);
  //   } catch (err) {
  //     setError(err.message);
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
async function handleCompare() {
    if (!oldReport || !newReport) {
      setError("Please select both reports to compare");
      return;
    }

    if (oldReport.reportName === newReport.reportName && 
        oldReport.reportType === newReport.reportType) {
      setError("Please select two different reports");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {
        oldReportName: oldReport.reportName,
        oldReportType: oldReport.reportType,
        newReportName: newReport.reportName,
        newReportType: newReport.reportType,
        language: "en"
      };
      
      const result = await compareReports(params, user);
      setComparison(result.comparison);
    } catch (err) {
      setError(err.message || "Failed to compare reports");
      console.error(err);
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

  return (
    <div className="compare-container">
      {/* Info Banner */}
      <div className="compare-info-banner">
        <div className="banner-icon">📊</div>
        <div className="banner-content">
          <h3>Compare Medical Reports</h3>
          <p>Track changes in your health parameters over time by comparing two reports of the same type</p>
        </div>
      </div>

      {/* Selection Section */}
      <div className="compare-selection-section">
        <div className="selection-grid">
          {/* Old Report Selection */}
          <div className="report-selector">
            <div className="selector-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <h4>Older Report</h4>
            </div>
            <select
              value={oldReport ? `${oldReport.reportName}-${oldReport.reportType}` : ""}
              onChange={(e) => {
                if (e.target.value) {
                  const [name, type] = e.target.value.split("-");
                  const report = reports.find(
                    (r) => r.reportName === name && r.reportType === type
                  );
                  setOldReport(report);
                  setError(null);
                }
              }}
              className="report-select"
            >
              <option value="">Select older report...</option>
              {reports.map((report, index) => (
                <option
                  key={index}
                  value={`${report.reportName}-${report.reportType}`}
                >
                  {report.reportName} ({report.reportType}) - {formatDate(report.createdAt)}
                </option>
              ))}
            </select>
            {oldReport && (
              <div className="selected-report-card">
                <div className="report-card-icon">📋</div>
                <div className="report-card-info">
                  <strong>{oldReport.reportName}</strong>
                  <span className="report-card-type">{oldReport.reportType}</span>
                  <span className="report-card-date">{formatDate(oldReport.createdAt)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="compare-arrow">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>

          {/* New Report Selection */}
          <div className="report-selector">
            <div className="selector-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <h4>Newer Report</h4>
            </div>
            <select
              value={newReport ? `${newReport.reportName}-${newReport.reportType}` : ""}
              onChange={(e) => {
                if (e.target.value) {
                  const [name, type] = e.target.value.split("-");
                  const report = reports.find(
                    (r) => r.reportName === name && r.reportType === type
                  );
                  setNewReport(report);
                  setError(null);
                }
              }}
              className="report-select"
            >
              <option value="">Select newer report...</option>
              {reports.map((report, index) => (
                <option
                  key={index}
                  value={`${report.reportName}-${report.reportType}`}
                >
                  {report.reportName} ({report.reportType}) - {formatDate(report.createdAt)}
                </option>
              ))}
            </select>
            {newReport && (
              <div className="selected-report-card">
                <div className="report-card-icon">📋</div>
                <div className="report-card-info">
                  <strong>{newReport.reportName}</strong>
                  <span className="report-card-type">{newReport.reportType}</span>
                  <span className="report-card-date">{formatDate(newReport.createdAt)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        <button
          className="compare-btn"
          onClick={handleCompare}
          disabled={loading || !oldReport || !newReport}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Comparing Reports...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Compare Reports
            </>
          )}
        </button>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="comparison-results">
          <div className="results-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <h3>Comparison Analysis</h3>
          </div>
          <div className="comparison-content">
            <ReactMarkdown>{comparison}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!comparison && !loading && (
        <div className="compare-empty-state">
          <div className="empty-icon">📊</div>
          <h4>No Comparison Yet</h4>
          <p>Select two reports above to see a detailed comparison analysis</p>
          <div className="empty-tips">
            <p><strong>Comparison Tips:</strong></p>
            <ul>
              <li>Choose reports of the same type for accurate comparison</li>
              <li>Select an older report and a newer report</li>
              <li>Review trends in your health parameters</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}