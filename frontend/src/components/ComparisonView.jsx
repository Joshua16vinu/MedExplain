// import ReactMarkdown from "react-markdown";
// import "./ComparisonView.css";

// export default function ComparisonView({ comparison, oldReport, newReport }) {
//   if (!comparison) {
//     return null;
//   }

//   return (
//     <div className="comparison-container">
//       <div className="comparison-header">
//         <h2>Report Comparison</h2>
//         {oldReport && newReport && (
//           <div className="comparison-meta">
//             <div className="comparison-report">
//               <span className="comparison-label">Old:</span>
//               <span className="comparison-value">
//                 {oldReport.reportName} ({oldReport.reportType})
//               </span>
//             </div>
//             <div className="comparison-arrow">→</div>
//             <div className="comparison-report">
//               <span className="comparison-label">New:</span>
//               <span className="comparison-value">
//                 {newReport.reportName} ({newReport.reportType})
//               </span>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="comparison-card">
//         <ReactMarkdown>{comparison}</ReactMarkdown>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ComparisonView.css";

export default function ComparisonView({ comparison, oldReport, newReport, onUploadNew, user }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [reportType, setReportType] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadFile(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !reportType) {
      alert("Please select a file and report type");
      return;
    }

    setUploading(true);
    try {
      // Call the parent's upload handler
      await onUploadNew(uploadFile, reportType);
      setShowUploadModal(false);
      setUploadFile(null);
      setReportType("");
    } catch (err) {
      alert("Failed to upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

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
    <div className="comparison-view-container">
      {/* Header with Report Info */}
      <div className="comparison-header">
        <div className="header-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <h2>Comparison Analysis</h2>
        </div>
        
        {onUploadNew && (
          <button 
            className="upload-new-btn"
            onClick={() => setShowUploadModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload & Compare New Report
          </button>
        )}
      </div>

      {/* Reports Comparison Info */}
      <div className="reports-info-section">
        <div className="report-info-card old-report">
          <div className="report-badge">Previous</div>
          <div className="report-icon">📋</div>
          <div className="report-details">
            <h4>{oldReport?.reportName || "Old Report"}</h4>
            <div className="report-meta">
              <span className="report-type">{oldReport?.reportType || "N/A"}</span>
              <span className="report-date">{formatDate(oldReport?.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="comparison-arrow-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>

        <div className="report-info-card new-report">
          <div className="report-badge">Latest</div>
          <div className="report-icon">📄</div>
          <div className="report-details">
            <h4>{newReport?.reportName || "New Report"}</h4>
            <div className="report-meta">
              <span className="report-type">{newReport?.reportType || "N/A"}</span>
              <span className="report-date">{formatDate(newReport?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Content */}
      <div className="comparison-content-card">
        <div className="content-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <h3>Detailed Comparison</h3>
        </div>
        <div className="comparison-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{comparison}</ReactMarkdown>
        </div>
      </div>

      {/* Tips Card */}
      <div className="tips-card">
        <div className="tips-icon">💡</div>
        <div className="tips-content">
          <h4>Understanding Your Comparison</h4>
          <ul>
            <li>Review parameters that show significant changes</li>
            <li>Note trends - improving, stable, or declining</li>
            <li>Discuss concerning changes with your healthcare provider</li>
            <li>Keep track of lifestyle changes that may have influenced results</li>
          </ul>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload New Report for Comparison</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                Upload a new report to compare with your selected previous report
              </p>

              {/* File Upload */}
              <div className="file-upload-zone">
                <input
                  id="comparison-file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="file-input-hidden"
                />
                <label htmlFor="comparison-file-upload" className="file-upload-label">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span className="upload-text">
                    {uploadFile ? uploadFile.name : "Click to upload PDF file"}
                  </span>
                  <span className="upload-subtext">
                    {uploadFile ? "Click to change file" : "Maximum file size: 10MB"}
                  </span>
                </label>
              </div>

              {/* Report Type Selection */}
              <div className="form-group">
                <label htmlFor="report-type-select">Report Type</label>
                <select
                  id="report-type-select"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="type-select"
                >
                  <option value="">Select report type...</option>
                  <option value="CBC">CBC (Complete Blood Count)</option>
                  <option value="LIPID">Lipid Profile</option>
                  <option value="LFT">LFT (Liver Function Test)</option>
                  <option value="KFT">KFT (Kidney Function Test)</option>
                  <option value="THYROID">Thyroid Function Test</option>
                  <option value="DIABETES">Diabetes Panel</option>
                  <option value="VITAMIN">Vitamin Panel</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                    setReportType("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-upload"
                  onClick={handleUpload}
                  disabled={!uploadFile || !reportType || uploading}
                >
                  {uploading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Upload & Compare
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}