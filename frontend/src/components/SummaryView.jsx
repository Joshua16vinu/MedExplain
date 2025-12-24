import ReactMarkdown from "react-markdown";
import "./SummaryView.css";

export default function SummaryView({ summary, report, onOpenChatbot }) {
  return (
    <div className="summary-card">
      <div className="summary-header">
        <h2>Report Summary</h2>
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
      <ReactMarkdown>{summary}</ReactMarkdown>
    </div>
  );
}
