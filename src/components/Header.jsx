import { useTranslation } from "react-i18next";

function Header({
  currentUserEmail,
  isOnline,
  darkMode,
  onToggleDarkMode,
  onLogout,
  onLanguageChange,
  currentLanguage,
}) {
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <div>
        <h1>{t("appTitle")}</h1>
        <p>{t("appSubtitle")}</p>

        {currentUserEmail && (
          <small>
            {t("loggedInAs")}: {currentUserEmail}
          </small>
        )}
      </div>

      <div className="header-actions">
        <span className={isOnline ? "online-status" : "offline-status"}>
          {isOnline ? t("online") : t("offline")}
        </span>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="theme-btn"
        >
          {darkMode ? t("light") : t("dark")}
        </button>

        <select
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="en">English</option>
          <option value="ur">اردو</option>
        </select>

        <button
          type="button"
          onClick={onLogout}
          className="logout-btn"
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
}

export default Header;