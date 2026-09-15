import { useTranslation } from "react-i18next";

const groups = [
  {
    title: "Workspace",
    items: [
      ["dashboard", "Dashboard", "⌂"],
      ["tasks", "My Tasks", "✓"],
      ["important", "Important", "★"],
      ["today", "Today", "◷"],
      ["upcoming", "Upcoming", "→"],
      ["completed", "Completed", "✓"],
    ],
  },
  {
    title: "Productivity",
    items: [
      ["goals", "Goals", "◎"],
      ["productivity", "Productivity", "▥"],
      ["reminders", "Reminders", "◉"],
      ["calendar", "Calendar", "□"],
      ["categories", "Categories", "#"],
    ],
  },
  {
    title: "General",
    items: [
      ["sync", "Sync", "↻"],
      ["feed", "Feed", "≡"],
      ["whats-new", "What's New", "✦"],
      ["help", "Help & Support", "?"],
      ["feedback", "Feedback", "↗"],
      ["about", "About", "i"],
    ],
  },
  {
    title: "Settings",
    items: [
      ["account", "Account Settings", "♙"],
      ["theme", "Theme", "◐"],
      ["language", "Language", "文"],
      ["notifications", "Notifications", "♢"],
      ["privacy", "Privacy & Security", "⌁"],
    ],
  },
];

function Sidebar({
  activeView,
  onNavigate,
  onLogout,
  currentUser,
  darkMode,
  onToggleDarkMode,
  language,
  onLanguageChange,
  isOnline,
  mobileOpen,
  onClose,
}) {
  const { t } = useTranslation();

  const displayName = currentUser?.name?.trim() || currentUser?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const handleNavigate = (view) => {
    onNavigate(view);
    onClose?.();
  };

  return (
    <>
      {mobileOpen && <button className="sidebar-overlay" aria-label="Close menu" onClick={onClose} />}
      <aside className={`app-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">✓</div>
          <div>
            <strong>TaskFlow</strong>
            <span>Productivity</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">×</button>
        </div>

        <div className="sidebar-user-card">
          <div className="avatar">{initials || "U"}</div>
          <div className="user-copy">
            <strong>{displayName}</strong>
            <span>{currentUser?.email || ""}</span>
          </div>
          <span className={`status-dot ${isOnline ? "online" : "offline"}`} title={isOnline ? "Online" : "Offline"} />
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {groups.map((group) => (
            <div className="sidebar-group" key={group.title}>
              <p>{group.title}</p>
              {group.items.map(([id, label, icon]) => (
                <button
                  type="button"
                  key={id}
                  className={`sidebar-item ${activeView === id ? "active" : ""}`}
                  onClick={() => handleNavigate(id)}
                >
                  <span className="sidebar-icon">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-quick-setting">
            <span>Theme</span>
            <button type="button" className="mini-switch" onClick={onToggleDarkMode} aria-label="Toggle theme">
              <span className={darkMode ? "on" : ""} />
            </button>
          </div>
          <div className="sidebar-quick-setting">
            <span>Language</span>
            <select value={language} onChange={(e) => onLanguageChange(e.target.value)} aria-label="Language">
              <option value="en">EN</option>
              <option value="ur">اردو</option>
            </select>
          </div>
          <button type="button" className="sidebar-logout" onClick={onLogout}>
            <span>↪</span> {t("logout")}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
