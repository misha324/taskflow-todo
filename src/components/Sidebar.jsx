
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const groups = [
  {
    id: "workspace",
    titleKey: "sidebar.workspace",
    items: [
      ["dashboard", "sidebar.dashboard", "⌂"],
      ["tasks", "sidebar.tasks", "✓"],
      ["important", "sidebar.important", "★"],
      ["today", "sidebar.today", "◷"],
      ["upcoming", "sidebar.upcoming", "→"],
      ["completed", "sidebar.completed", "✓"],
    ],
  },
  {
    id: "productivity",
    titleKey: "sidebar.productivity",
    items: [
      ["goals", "sidebar.goals", "◎"],
      ["productivity", "sidebar.productivity", "▥"],
      ["reminders", "sidebar.reminders", "◉"],
      ["calendar", "sidebar.calendar", "□"],
      ["categories", "sidebar.categories", "#"],
    ],
  },
  {
    id: "general",
    titleKey: "sidebar.general",
    items: [
      ["sync", "sidebar.syncCenter", "↻"],
      ["feed", "sidebar.activity", "≡"],
      ["whats-new", "sidebar.whatsNew", "✦"],
      ["help", "sidebar.help", "?"],
      ["feedback", "sidebar.feedback", "↗"],
      ["about", "sidebar.about", "i"],
    ],
  },
  {
    id: "settings",
    titleKey: "sidebar.settings",
    items: [
      ["account", "settings.account", "♙"],
      ["language", "settings.language", "文"],
      ["notifications", "settings.notifications", "♢"],
      ["privacy", "settings.security", "⌁"],
    ],
  },
];

function Sidebar({
  activeView,
  onNavigate,
  onLogout,
  currentUser,
  mobileOpen,
  onClose,
}) {
  const { t } = useTranslation();

  const [openGroup, setOpenGroup] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName =
    currentUser?.name?.trim() ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  // Automatically open the section containing the current page
  useEffect(() => {
    const currentGroup = groups.find((group) =>
      group.items.some(([id]) => id === activeView)
    );

    if (currentGroup) {
      setOpenGroup(currentGroup.id);
    }
  }, [activeView]);

  const handleGroupClick = (groupId) => {
    setOpenGroup((current) =>
      current === groupId ? null : groupId
    );
  };

  const handleNavigate = (view) => {
    onNavigate(view);
    setProfileOpen(false);
    onClose?.();
  };

  const handleLogout = () => {
    setProfileOpen(false);
    onLogout();
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label={t("sidebar.closeMenu")}
          onClick={onClose}
        />
      )}

      <aside
        className={`app-sidebar ${
          mobileOpen ? "is-open" : ""
        }`}
      >
        {/* BRAND */}
        <div className="sidebar-brand">
          <div className="brand-mark">✓</div>

          <div className="brand-text">
            <strong>TaskFlow</strong>
            <span>{t("appSubtitle")}</span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label={t("sidebar.closeSidebar")}
          >
            ×
          </button>
        </div>

        {/* NAVIGATION */}
        <nav
          className="sidebar-nav"
          aria-label={t("sidebar.mainNavigation")}
        >
          {groups.map((group) => {
            const isOpen = openGroup === group.id;

            return (
              <div
                className={`sidebar-section ${
                  isOpen ? "expanded" : ""
                }`}
                key={group.id}
              >
                <button
                  type="button"
                  className="sidebar-section-button"
                  onClick={() =>
                    handleGroupClick(group.id)
                  }
                  aria-expanded={isOpen}
                >
                  <span className="sidebar-section-title">
                    {t(group.titleKey)}
                  </span>

                  <span className="section-arrow">
                    {isOpen ? "⌄" : "›"}
                  </span>
                </button>

                {isOpen && (
                  <div className="sidebar-submenu">
                    {group.items.map(
                      ([id, labelKey, icon]) => (
                        <button
                          type="button"
                          key={id}
                          className={`sidebar-item ${
                            activeView === id
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleNavigate(id)
                          }
                        >
                          <span className="sidebar-icon">
                            {icon}
                          </span>

                          <span className="sidebar-item-text">
                            {t(labelKey)}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* PROFILE */}
        <div className="sidebar-profile-wrapper">
          <button
            type="button"
            className={`sidebar-profile ${
              profileOpen ? "open" : ""
            }`}
            onClick={() =>
              setProfileOpen((current) => !current)
            }
            aria-expanded={profileOpen}
          >
            <div className="profile-avatar">
              {initials || "U"}
            </div>

            <div className="profile-name">
              <strong>{displayName}</strong>
            </div>

            <span className="profile-arrow">
              {profileOpen ? "⌃" : "⌄"}
            </span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown">

              {/* ACCOUNT */}
              <button
                type="button"
                className="profile-dropdown-item"
                onClick={() =>
                  handleNavigate("account")
                }
              >
                <span>♙</span>
                <span>
                  {t("settings.account")}
                </span>
              </button>

              {/* THEME */}
              <button
                type="button"
                className="profile-dropdown-item"
                onClick={() =>
                  handleNavigate("theme")
                }
              >
                <span>◐</span>
                <span>
                  {t("settings.theme")}
                </span>
              </button>

              {/* LOGOUT */}
              <button
                type="button"
                className="profile-dropdown-item logout-dropdown"
                onClick={handleLogout}
              >
                <span>↪</span>
                <span>{t("logout")}</span>
              </button>

            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
