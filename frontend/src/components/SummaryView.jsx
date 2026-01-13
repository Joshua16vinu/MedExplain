// import ReactMarkdown from "react-markdown";
// import "./SummaryView.css";

// export default function SummaryView({ summary, report, onOpenChatbot }) {
//   return (
//     <div className="summary-card">
//       <div className="summary-header">
//         <h2>Report Summary</h2>
//         {report && onOpenChatbot && (
//           <button 
//             className="chatbot-toggle-btn"
//             onClick={() => onOpenChatbot(report)}
//             title="Ask questions about this report"
//           >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//             </svg>
//             Ask Questions
//           </button>
//         )}
//       </div>
//       <ReactMarkdown>{summary}</ReactMarkdown>
//     </div>
//   );
// }


import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./SummaryView.css";

export default function SummaryView({ summary, report, onOpenChatbot }) {
  return (
    <div className="summary-container">
      {/* Summary Card */}
      <div className="summary-card">
        <div className="summary-header">
          <div className="summary-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            <h2>Report Summary</h2>
          </div>
          {report && onOpenChatbot && (
            <button 
              className="chatbot-toggle-btn"
              onClick={() => onOpenChatbot(report)}
              title="Ask questions about this report"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Ask Questions
            </button>
          )}
        </div>

        {report && (
          <div className="report-info-banner">
            <div className="report-info-item">
              <span className="info-label">Report Name:</span>
              <span className="info-value">{report.reportName}</span>
            </div>
            <div className="report-info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">{report.reportType}</span>
            </div>
          </div>
        )}

         <div className="summary-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
        </div>
      </div>

      {/* Help Card */}
      <div className="help-card">
        <div className="help-icon">💡</div>
        <div className="help-content">
          <h4>Understanding Your Report</h4>
          <p>This summary is AI-generated to help you understand your medical report in simple terms.</p>
          <ul>
            <li>Read through all sections carefully</li>
            <li>Note any values marked as abnormal</li>
            <li>Use the chatbot for specific questions</li>
            <li>Always consult your doctor for medical advice</li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <div>
          <strong>Medical Disclaimer:</strong> This is an AI-generated summary for informational purposes only. Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.
        </div>
      </div>
    </div>
  );
}