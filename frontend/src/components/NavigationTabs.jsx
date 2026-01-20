// components/NavigationTabs.jsx
import { UploadCloud, FileText, GitCompare } from "lucide-react";

function NavigationTabs({ activeView, onTabChange }) {
  const tabs = [
    { id: "upload", label: "Upload Report", icon: UploadCloud },
    { id: "list", label: "My Reports", icon: FileText },
    { id: "compare", label: "Compare Reports", icon: GitCompare }
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto scroller-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                  ${isActive
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NavigationTabs;