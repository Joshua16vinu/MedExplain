import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function UserProfile({ user, onLogout }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error("Error signing out:", error);
      onLogout();
    }
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL || null;
  const email = user?.email || "";

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Default profile photo URL using a placeholder service if no photo
  const defaultPhotoURL = !photoURL
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff&size=128`
    : null;

  // Handle image load error - fallback to initials
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.nextSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {(photoURL || defaultPhotoURL) ? (
          <div className="relative">
            <img
              src={photoURL || defaultPhotoURL}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
              onError={handleImageError}
              referrerPolicy="no-referrer"
            />
            {/* Fallback placeholder (hidden by default, shown on error) */}
            <div className="hidden absolute inset-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 border border-emerald-200">
              {getInitials(displayName)}
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 border border-emerald-200">
            {getInitials(displayName)}
          </div>
        )}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</span>
          <span className="text-xs text-slate-500">{email}</span>
        </div>
      </div>

      {/* Logout button is handled in Header usually, but keeping this structure if used elsewhere */}
    </div>
  );
}

