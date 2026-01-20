// components/Header.jsx
import { LogOut, Activity, Stethoscope } from "lucide-react";

export default function Header({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
              <Stethoscope className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                MEDEXPLAIN
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                Simple Health Reports
              </p>
            </div>
          </div>

          {/* User Section */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Profile Pic */}
                <div className="relative">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=0ea5e9&color=fff`}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border border-slate-200 object-cover shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-bold text-slate-700 leading-tight">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 mx-1"></div>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
