import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getReports, compareReports } from "../services/api";
import {
  BarChart2,
  ArrowRight,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader,
  ArrowLeftRight,
  TrendingUp
} from "lucide-react";

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

  const ReportSelectCard = ({ label, selected, onSelect, icon: Icon, colorClass }) => (
    <div className="flex-1 min-w-[300px]">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h3 className="font-semibold text-slate-700">{label}</h3>
      </div>

      <div className="relative group">
        <select
          value={selected ? `${selected.reportName}-${selected.reportType}` : ""}
          onChange={(e) => {
            if (e.target.value) {
              const [name, type] = e.target.value.split("-");
              const report = reports.find(
                (r) => r.reportName === name && r.reportType === type
              );
              onSelect(report);
              setError(null);
            }
          }}
          className="w-full p-4 bg-white border border-slate-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm group-hover:border-slate-300"
        >
          <option value="">Select a report...</option>
          {reports.map((report, index) => (
            <option
              key={index}
              value={`${report.reportName}-${report.reportType}`}
            >
              {report.reportName} ({report.reportType}) - {formatDate(report.createdAt)}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ArrowRight className="w-4 h-4 rotate-90" />
        </div>
      </div>

      {selected && (
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{selected.reportName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
                  {selected.reportType}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(selected.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Compare Progress</h2>
            <p className="text-indigo-100 mt-1 text-lg">
              Track health changes by comparing two medical reports side by side.
            </p>
          </div>
        </div>
      </div>

      {/* Selection Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <ReportSelectCard
            label="Base Report (Old)"
            selected={oldReport}
            onSelect={setOldReport}
            icon={Calendar}
            colorClass="text-slate-500"
          />

          <div className="flex items-center justify-center">
            <div className="p-3 bg-slate-50 rounded-full text-slate-300 rotate-90 lg:rotate-0">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
          </div>

          <ReportSelectCard
            label="Comparison Report (New)"
            selected={newReport}
            onSelect={setNewReport}
            icon={BarChart2}
            colorClass="text-sky-500"
          />
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center gap-2 text-red-600 font-medium">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleCompare}
            disabled={loading || !oldReport || !newReport}
            className="flex items-center gap-2 px-8 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-500/20 hover:bg-sky-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing Difference...
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-5 h-5" />
                Compare Reports
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Area */}
      {comparison && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Analysis Result</h3>
          </div>
          <div className="p-8">
            <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-strong:text-slate-900 prose-li:text-slate-600">
              <ReactMarkdown>{comparison}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Empty State / Tips */}
      {!comparison && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "Consistency",
              text: "Choose reports of the same type (e.g., both CBC) for accurate results"
            },
            {
              icon: "📅",
              title: "Timeline",
              text: "Select an older report on the left and a newer one on the right"
            },
            {
              icon: "📈",
              title: "Trends",
              text: "Look for improvements or concerning changes in your vital metrics"
            }
          ].map((tip, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
              <div className="text-2xl mb-3">{tip.icon}</div>
              <h4 className="font-bold text-slate-700 mb-2">{tip.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
