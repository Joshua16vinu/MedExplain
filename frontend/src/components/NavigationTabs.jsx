// components/NavigationTabs.jsx
function NavigationTabs({ activeView, onTabChange }) {
  const tabs = [
    { id: "upload", label: "Upload" },
    { id: "list", label: "My Reports" },
    { id: "compare", label: "Compare" }
  ];

  return (
    <div className="nav-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeView === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default NavigationTabs;