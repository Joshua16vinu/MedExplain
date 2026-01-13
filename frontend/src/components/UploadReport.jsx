

// import { useState } from "react";
// import { uploadReport } from "../services/api";
// import "./UploadReport.css";

// export default function UploadReport({ user, onResult, onUploadSuccess }) {
//   const [file, setFile] = useState(null);
//   const [reportType, setReportType] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [language, setLanguage] = useState("en");

//   async function handleUpload() {
//     if (!file || !user) {
//       setError("User not logged in or file missing");
//       return;
//     }

//     if (!reportType) {
//       setError("Please select a report type");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const result = await uploadReport(file, reportType, language, user);
//       onResult({
//         summary: result.summary,
//         reportName: file.name.replace(/\.[^/.]+$/, "").toLowerCase(),
//         reportType: reportType
//       });
      
//       if (onUploadSuccess) {
//         onUploadSuccess();
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="upload-container">
//       {/* Medical Info Card */}
//       <div className="medical-info-card">
//         <div className="info-icon">ℹ️</div>
//         <div className="info-content">
//           <h4>Quick Guide</h4>
//           <ul>
//             <li>Upload PDF medical reports only</li>
//             <li>Choose the correct report type</li>
//             <li>Select your preferred language</li>
//             <li>Get AI-powered summary instantly</li>
//           </ul>
//         </div>
//       </div>

//       {/* Upload Card */}
//       <div className="upload-card">
//         <div className="upload-header">
//           <div className="upload-icon">📄</div>
//           <h2>Upload Medical Report</h2>
//           <p className="subtitle">Select a PDF file to generate an easy-to-understand summary</p>
//         </div>
        
//         {error && (
//           <div className="error-message">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"></circle>
//               <line x1="12" y1="8" x2="12" y2="12"></line>
//               <line x1="12" y1="16" x2="12.01" y2="16"></line>
//             </svg>
//             {error}
//           </div>
//         )}

//         <div className="file-upload-wrapper">
//           <input 
//             id="file-input"
//             type="file" 
//             accept=".pdf"
//             onChange={e => {
//               setFile(e.target.files[0]);
//               setError(null);
//             }}
//             className="file-input-hidden"
//           />
//           <label htmlFor="file-input" className="file-input-label">
//             <svg className="file-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="17 8 12 3 7 8"></polyline>
//               <line x1="12" y1="3" x2="12" y2="15"></line>
//             </svg>
//             <span className="file-input-text">
//               {file ? file.name : "Choose PDF File"}
//             </span>
//           </label>
//           {file && (
//             <div className="file-selected-indicator">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <polyline points="20 6 9 17 4 12"></polyline>
//               </svg>
//               File selected
//             </div>
//           )}
//         </div>

//         <div className="form-group">
//           <label className="form-label">
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//               <polyline points="14 2 14 8 20 8"></polyline>
//             </svg>
//             Report Type
//           </label>
//           <select
//             value={reportType}
//             onChange={(e) => {
//               setReportType(e.target.value);
//               setError(null);
//             }}
//             className="type-select"
//           >
//             <option value="">Select report type...</option>
//             <option value="CBC">🩸 CBC (Complete Blood Count)</option>
//             <option value="LIPID">💧 Lipid Profile</option>
//             <option value="LFT">🫀 LFT (Liver Function Test)</option>
//             <option value="KFT">🫘 KFT (Kidney Function Test)</option>
//             <option value="THYROID">🦋 Thyroid Function Test</option>
//             <option value="OTHER">📋 Other</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label className="form-label">
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"></circle>
//               <path d="M12 6v6l4 2"></path>
//             </svg>
//             Language
//           </label>
//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="type-select"
//           >
//             <option value="en">🇬🇧 English</option>
//             <option value="hi">🇮🇳 Hindi</option>
//             <option value="mr">🇮🇳 Marathi</option>
//           </select>
//         </div>
        
//         <button 
//           className="upload-btn" 
//           onClick={handleUpload} 
//           disabled={loading || !file || !reportType}
//         >
//           {loading ? (
//             <>
//               <span className="loading-spinner"></span>
//               Analyzing Report...
//             </>
//           ) : (
//             <>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                 <polyline points="17 8 12 3 7 8"></polyline>
//                 <line x1="12" y1="3" x2="12" y2="15"></line>
//               </svg>
//               Upload & Summarize
//             </>
//           )}
//         </button>
//       </div>

//       {/* Features Card */}
//       <div className="features-card">
//         <h4>Why Use MedExplain?</h4>
//         <div className="features-grid">
//           <div className="feature-item">
//             <div className="feature-icon">⚡</div>
//             <div className="feature-text">
//               <strong>Instant Analysis</strong>
//               <p>Get summaries in seconds</p>
//             </div>
//           </div>
//           <div className="feature-item">
//             <div className="feature-icon">🌍</div>
//             <div className="feature-text">
//               <strong>Multi-Language</strong>
//               <p>Available in 3 languages</p>
//             </div>
//           </div>
//           <div className="feature-item">
//             <div className="feature-icon">💬</div>
//             <div className="feature-text">
//               <strong>AI Chatbot</strong>
//               <p>Ask questions anytime</p>
//             </div>
//           </div>
//           <div className="feature-item">
//             <div className="feature-icon">📊</div>
//             <div className="feature-text">
//               <strong>Compare Reports</strong>
//               <p>Track your progress</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { uploadReport } from "../services/api";
import "./UploadReport.css";

export default function UploadReport({ user, onResult, onUploadSuccess }) {
  // Upload Section State
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");

  // Medical Terms Section State
  const [medicalTerm, setMedicalTerm] = useState("");
  const [termDefinition, setTermDefinition] = useState("");
  const [termLoading, setTermLoading] = useState(false);

  // Symptom Checker Section State
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [symptomLoading, setSymptomLoading] = useState(false);

  async function handleUpload() {
    if (!file || !user) {
      setError("User not logged in or file missing");
      return;
    }

    if (!reportType) {
      setError("Please select a report type");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await uploadReport(file, reportType, language, user);
      onResult({
        summary: result.summary,
        reportName: file.name.replace(/\.[^/.]+$/, "").toLowerCase(),
        reportType: reportType
      });
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMedicalTermSearch() {
    if (!medicalTerm.trim()) return;

    setTermLoading(true);
    setTermDefinition("");

    try {
      const { explainMedicalTerm } = await import("../services/api");
      const result = await explainMedicalTerm(medicalTerm, language, user);
      setTermDefinition(result.explanation);
    } catch (err) {
      setTermDefinition("Failed to get explanation. Please try again.");
      console.error(err);
    } finally {
      setTermLoading(false);
    }
  }

  async function handleSymptomCheck() {
    if (!symptoms.trim()) return;

    setSymptomLoading(true);
    setDiagnosis("");

    try {
      const { checkSymptoms } = await import("../services/api");
      const result = await checkSymptoms(symptoms, language, user);
      setDiagnosis(result.analysis);
    } catch (err) {
      setDiagnosis("Failed to analyze symptoms. Please try again.");
      console.error(err);
    } finally {
      setSymptomLoading(false);
    }
  }

  return (
    <div className="new-upload-container">
      {/* LEFT COLUMN */}
      <div className="left-column">
        {/* 1. UPLOAD REPORT SECTION */}
        <div className="section-card upload-section">
          <div className="section-header">
            <div className="header-icon">📄</div>
            <div>
              <h2>Upload Medical Report</h2>
              <p className="section-subtitle">Get AI-powered summary in seconds</p>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <div className="file-drop-zone">
            <input 
              id="file-input"
              type="file" 
              accept=".pdf"
              onChange={e => {
                setFile(e.target.files[0]);
                setError(null);
              }}
              className="file-input-hidden"
            />
            <label htmlFor="file-input" className="file-drop-label">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span className="drop-text">
                {file ? file.name : "Click to upload or drag PDF here"}
              </span>
              <span className="drop-subtext">Maximum file size: 10MB</span>
            </label>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="select-input"
              >
                <option value="">Select type...</option>
                <option value="CBC">🩸 Complete Blood Count</option>
                <option value="LIPID">💧 Lipid Profile</option>
                <option value="LFT">🫀 Liver Function Test</option>
                <option value="KFT">🫘 Kidney Function Test</option>
                <option value="THYROID">🦋 Thyroid Function</option>
                <option value="DIABETES">🍬 Diabetes Panel</option>
                <option value="OTHER">📋 Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="select-input"
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 Hindi</option>
                <option value="mr">🇮🇳 Marathi</option>
              </select>
            </div>
          </div>
          
          <button 
            className="primary-btn upload-btn" 
            onClick={handleUpload} 
            disabled={loading || !file || !reportType}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Upload & Summarize
              </>
            )}
          </button>
        </div>

        {/* 2. MEDICAL TERMS EXPLAINER */}
        <div className="section-card terms-section">
          <div className="section-header">
            <div className="header-icon">📚</div>
            <div>
              <h2>Medical Terms Explainer</h2>
              <p className="section-subtitle">Understand complex medical terminology</p>
            </div>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Enter medical term (e.g., Hemoglobin, Cholesterol)"
              value={medicalTerm}
              onChange={(e) => setMedicalTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMedicalTermSearch()}
              className="search-input"
            />
            <button 
              onClick={handleMedicalTermSearch}
              disabled={termLoading || !medicalTerm.trim()}
              className="search-btn"
            >
              {termLoading ? (
                <span className="spinner-small"></span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              )}
            </button>
          </div>

          {termDefinition && (
            <div className="result-box term-result">
              <div className="result-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <strong>{medicalTerm}</strong>
              </div>
              <p>{termDefinition}</p>
            </div>
          )}

          {!termDefinition && !termLoading && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>Enter a medical term to get a simple explanation</p>
            </div>
          )}
        </div>

        {/* 3. SYMPTOM CHECKER */}
        <div className="section-card symptom-section">
          <div className="section-header">
            <div className="header-icon">🩺</div>
            <div>
              <h2>Symptom Checker</h2>
              <p className="section-subtitle">Understand what your symptoms might mean</p>
            </div>
          </div>

          <div className="symptom-disclaimer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>For informational purposes only. Not a medical diagnosis.</span>
          </div>

          <textarea
            placeholder="Describe your symptoms (e.g., fever, headache, fatigue)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="symptom-input"
            rows="4"
          />

          <button 
            onClick={handleSymptomCheck}
            disabled={symptomLoading || !symptoms.trim()}
            className="primary-btn check-btn"
          >
            {symptomLoading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                Check Symptoms
              </>
            )}
          </button>

          {diagnosis && (
            <div className="result-box symptom-result">
              <div className="result-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <strong>Analysis</strong>
              </div>
              <p>{diagnosis}</p>
              <div className="consult-reminder">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Always consult a healthcare professional for proper diagnosis
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN - TESTIMONIALS */}
      <div className="right-column">
        <div className="testimonials-section">
          <div className="testimonials-header">
            <h3>What Our Users Say</h3>
            <p>Real experiences from people like you</p>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              MedExplain helped me understand my blood test results before meeting my doctor. 
              It made the conversation so much easier!
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👩‍⚕️</div>
              <div>
                <strong>Priya Sharma</strong>
                <span>Mumbai, Maharashtra</span>
              </div>
            </div>
            <div className="rating">⭐⭐⭐⭐⭐</div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              The symptom checker gave me peace of mind and helped me decide when to see a doctor. 
              Very helpful tool!
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍💼</div>
              <div>
                <strong>Rajesh Kumar</strong>
                <span>Pune, Maharashtra</span>
              </div>
            </div>
            <div className="rating">⭐⭐⭐⭐⭐</div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              Finally, a platform that explains medical reports in simple language! 
              The comparison feature is amazing for tracking health progress.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍🦳</div>
              <div>
                <strong>Dr. Suresh Patel</strong>
                <span>Nagpur, Maharashtra</span>
              </div>
            </div>
            <div className="rating">⭐⭐⭐⭐⭐</div>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <strong>10,000+</strong>
              <span>Reports Analyzed</span>
            </div>
            <div className="stat-item">
              <strong>5,000+</strong>
              <span>Happy Users</span>
            </div>
            <div className="stat-item">
              <strong>98%</strong>
              <span>Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}