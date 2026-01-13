// components/Header.jsx
import UserProfile from "./UserProfile";

function Header({ user, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1>MEDEXPLAIN</h1>
        <p className="tagline">Medical Report Summarizer for Rural Clinics</p>
      </div>

      {user && (
        <div className="header-right">
          <UserProfile user={user} onLogout={onLogout} />
        </div>
      )}
    </header>
  );
}

export default Header;