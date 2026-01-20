import { useState, useEffect } from "react";
import { uploadReport } from "../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileText,
  UploadCloud,
  Search,
  Activity,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Loader,
  BookOpen,
  Stethoscope,
  Quote,
  Star
} from "lucide-react";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (easeOutExpo)
      const ease = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

      setCount(Math.floor(end * ease(percentage)));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}</>;
}

// Testimonials Data
const testimonials = [
  {
    text: "MedExplain helped me understand my blood test results before meeting my doctor. It made the conversation so much easier!",
    author: "Priya Sharma",
    role: "Patient, Mumbai",
    avatar: "PS"
  },
  {
    text: "The symptom checker gave me peace of mind and helped me decide when to see a doctor. Very helpful tool!",
    author: "Rajesh Kumar",
    role: "Parent, Pune",
    avatar: "RK"
  },
  {
    text: "Finally, a tool that explains medical jargon in simple Hindi. It's been a blessing for my elderly parents.",
    author: "Anita Desai",
    role: "Caregiver, Delhi",
    avatar: "AD"
  }
];

export default function UploadReport({ user, onResult, onUploadSuccess, summary }) {
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
  const isSummaryActive = Boolean(summary);

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    <div className={`grid gap-8 w-full ${!isSummaryActive ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>

      {/* LEFT COLUMN (Upload & Tools) - Spans 8 cols */}
      <div className={`${!isSummaryActive ? 'lg:col-span-8' : 'w-full'} space-y-8`}>

        {/* 1. UPLOAD REPORT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-sky-600" />
                  Upload Medical Report
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                  Understand your medical report in seconds.
                </p>
              </div>
              <div className="hidden sm:block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
                Smart Analysis
              </div>
            </div>

            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Enhanced Drop Zone */}
              <div className="relative">
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={e => {
                    setFile(e.target.files[0]);
                    setError(null);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`
                  border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 transform
                  flex flex-col items-center gap-4 bg-gradient-to-b from-slate-50/50 to-white
                  ${file
                    ? "border-sky-500 bg-sky-50/50 ring-4 ring-sky-500/10 scale-[1.01]"
                    : "border-slate-300 hover:border-sky-400 hover:bg-sky-50/30 hover:scale-[1.01]"}
                `}>
                  <div className={`
                    p-5 rounded-full shadow-sm transition-all duration-300
                    ${file
                      ? "bg-sky-100 text-sky-600"
                      : "bg-white text-slate-400 group-hover:text-sky-500 group-hover:shadow-md"}
                  `}>
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-700">
                      {file ? file.name : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {file ? "Ready to upload" : "PDF files only (Max 10MB)"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Report Type</label>
                  <div className="relative">
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full p-3 pl-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all appearance-none cursor-pointer hover:border-sky-300"
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
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Language</label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-3 pl-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all appearance-none cursor-pointer hover:border-sky-300"
                    >
                      <option value="en">🇬🇧 English</option>
                      <option value="hi">🇮🇳 Hindi</option>
                      <option value="mr">🇮🇳 Marathi</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !file || !reportType}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-sky-600/20 hover:from-sky-500 hover:to-blue-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing Report...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    Generate Summary
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2 & 3. TOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medical Terms */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">Medical Dictionary</h3>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search term (e.g. Hemoglobin)"
                    value={medicalTerm}
                    onChange={(e) => setMedicalTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleMedicalTermSearch()}
                    className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                  <button
                    onClick={handleMedicalTermSearch}
                    disabled={termLoading || !medicalTerm.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-50 transition-colors"
                  >
                    {termLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>

                {termDefinition ? (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-sm animate-in fade-in zoom-in-95">
                    <p className="font-semibold text-emerald-800 mb-1">{medicalTerm}:</p>
                    <div className="prose prose-sm prose-emerald max-w-none text-slate-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{termDefinition}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Instantly understand complex medical terms found in your reports.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Symptom Checker */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">Symptom Checker</h3>
              </div>

              <div className="space-y-4">
                <textarea
                  placeholder="Describe symptoms..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm min-h-[50px] resize-none"
                  rows="2"
                />

                <button
                  onClick={handleSymptomCheck}
                  disabled={symptomLoading || !symptoms.trim()}
                  className="w-full py-2.5 px-4 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {symptomLoading ? "Checking..." : "Analyze Symptoms"}
                </button>

                {diagnosis && (
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm animate-in fade-in zoom-in-95 shadow-sm">
                    <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-500" />
                      Possible Causes:
                    </p>
                    <div className="prose prose-sm max-w-none text-slate-600 line-clamp-4 hover:line-clamp-none transition-all">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{diagnosis}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* RIGHT COLUMN (Stats, Features, Testimonials) - Spans 4 cols */}
      {!isSummaryActive && (
        <div className="lg:col-span-4 space-y-6">

          {/* 1. Stats Grid - Animated */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 flex items-baseline gap-0.5">
                <AnimatedCounter end={10} duration={2000} />
                <span>k+</span>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1 group-hover:text-blue-500 transition-colors">Reports Analyzed</div>
            </div>
            <div className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 flex items-baseline gap-0.5">
                <AnimatedCounter end={98} duration={2000} />
                <span>%</span>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1 group-hover:text-emerald-500 transition-colors">User Satisfaction</div>
            </div>
          </div>

          {/* 2. Why Choose MedExplain - Enhanced (Already done, keeping context) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Why MedExplain?
            </h3>
            <ul className="space-y-4">
              {[
                {
                  icon: "⚡",
                  title: "Instant Results",
                  desc: "Analysis in seconds",
                  color: "bg-amber-100 text-amber-600"
                },
                {
                  icon: "🔒",
                  title: "Private & Secure",
                  desc: "Bank-level encryption",
                  color: "bg-emerald-100 text-emerald-600"
                },
                {
                  icon: "🌍",
                  title: "Multi-Language",
                  desc: "English, Hindi, Marathi",
                  color: "bg-blue-100 text-blue-600"
                }
              ].map((item, i) => (
                <li
                  key={i}
                  className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:shadow-md border border-transparent hover:border-slate-100 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Dynamic Testimonials - Clean Theme Aligned Design */}
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl shadow-xl p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 ring-1 ring-white/20">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 group-hover:-translate-x-1/5 transition-transform duration-700"></div>
            <Quote className="absolute top-6 right-6 w-24 h-24 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-500" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 uppercase tracking-wider shadow-sm">
                  Community Stories
                </div>
              </div>

              <div className="relative flex-1 min-h-[220px]">
                {testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ease-out transform flex flex-col justify-between
                      ${idx === activeTestimonial
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                      }`}
                  >
                    <div className="space-y-6">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-amber-300 fill-amber-300 drop-shadow-sm" />)}
                      </div>

                      <p className="text-white text-lg font-medium leading-relaxed font-sans tracking-wide drop-shadow-sm">
                        "{t.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/10">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-sm font-bold text-sky-600 shadow-md ring-2 ring-white/30">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-white font-bold text-base shadow-sm">{t.author}</p>
                        <p className="text-sky-100 text-xs font-medium uppercase tracking-wide opacity-90">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Indicators */}
              <div className="flex gap-2 mt-6 justify-center">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 shadow-sm
                      ${idx === activeTestimonial ? "bg-white w-8" : "bg-white/30 w-2 hover:bg-white/50"}`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

