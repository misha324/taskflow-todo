import { useTranslation } from "react-i18next";

function Header({ isOnline }) {
  const { t, i18n } = useTranslation();

  const isUrdu = i18n.language === "ur";

  return (
    <header className="app-header">
      <div className="header-left">

        {/* ONLINE STATUS */}
        <div
          className={`header-status ${
            isOnline ? "online" : "offline"
          }`}
        >
          <span className="header-status-dot" />

          <span>
            {isOnline
              ? t("online")
              : t("offline")}
          </span>
        </div>

        {/* TITLE */}
        <div
          className={`header-title ${
            isUrdu ? "urdu-header-title" : ""
          }`}
        >
          <h1>{t("appTitle")}</h1>

          <p>{t("appSubtitle")}</p>
        </div>

      </div>
    </header>
  );
}

export default Header;