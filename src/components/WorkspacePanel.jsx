import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function WorkspacePanel({
  view,
  tasks,
  categories,
  currentUser,
  isOnline,
  darkMode,
  onToggleDarkMode,
  language,
  onLanguageChange,
  refetch,
  setCategoryFilter,
  setActiveView,
}) {
  const { t } = useTranslation();

  const [goal, setGoal] = useState(
    () => localStorage.getItem("todoGoal") || "10"
  );

  const [savedGoal, setSavedGoal] = useState(
    () => Number(localStorage.getItem("todoGoal") || 10)
  );

  const [notifications, setNotifications] = useState(
    () =>
      localStorage.getItem("todoNotifications") !== "false"
  );

  const [compact, setCompact] = useState(
    () => localStorage.getItem("todoCompact") === "true"
  );

  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  // ==========================================
  // TASK STATISTICS
  // ==========================================

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const active = tasks.length - completed;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const today = new Date().toLocaleDateString("en-CA");

  // ==========================================
  // UPCOMING TASKS
  // ==========================================

  const dueSoon = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          !task.completed && task.dueDate
      )
      .filter(
        (task) => task.dueDate >= today
      )
      .sort((a, b) =>
        a.dueDate.localeCompare(b.dueDate)
      )
      .slice(0, 5);
  }, [tasks, today]);

  // ==========================================
  // RECENT TASKS
  // ==========================================

  const recent = useMemo(
    () =>
      [...tasks]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 6),
    [tasks]
  );

  // ==========================================
  // SAVE GOAL
  // ==========================================

  const saveGoal = () => {
    const value = Math.max(
      1,
      Number(goal) || 1
    );

    localStorage.setItem(
      "todoGoal",
      String(value)
    );

    setSavedGoal(value);
  };

  // ==========================================
  // SAVE NOTIFICATIONS
  // ==========================================

  const saveNotifications = (value) => {
    setNotifications(value);

    localStorage.setItem(
      "todoNotifications",
      String(value)
    );
  };

  // ==========================================
  // SAVE COMPACT MODE
  // ==========================================

  const saveCompact = (value) => {
    setCompact(value);

    localStorage.setItem(
      "todoCompact",
      String(value)
    );
  };

  // ==========================================
  // TASK VIEWS
  // ==========================================

  if (
    [
      "dashboard",
      "tasks",
      "today",
      "important",
      "upcoming",
      "completed",
    ].includes(view)
  ) {
    return null;
  }

  // ==========================================
  // PANEL TITLE TRANSLATIONS
  // ==========================================

  const titleMap = {
    productivity: "productivity.title",
    goals: "goals.title",
    reminders: "reminders.title",
    calendar: "calendar.title",
    categories: "categories.title",
    sync: "sync.title",
    feed: "feed.title",
    "whats-new": "whatsNew.title",
    help: "help.title",
    feedback: "feedback.title",
    about: "about.title",
    account: "account.title",
    theme: "theme.title",
    language: "language.title",
    notifications: "notifications.title",
    privacy: "privacy.title",
  };

  const title = titleMap[view]
    ? t(titleMap[view])
    : t("appTitle");

  return (
    <section className="workspace-panel">
      {/* ==========================================
          PANEL HEADER
      ========================================== */}

      <div className="panel-heading">
        <div>
          <span className="eyebrow">
            {t("appTitle")}
          </span>

          <h2>{title}</h2>

          <p>
            {t("workspace.panelDescription")}
          </p>
        </div>
      </div>

      {/* ==========================================
          PRODUCTIVITY
      ========================================== */}

      {view === "productivity" && (
        <div className="panel-grid">
          <Metric
            title={t(
              "productivity.totalTasks"
            )}
            value={tasks.length}
            detail={t(
              "productivity.allTasks"
            )}
          />

          <Metric
            title={t(
              "productivity.active"
            )}
            value={active}
            detail={t(
              "productivity.inProgress"
            )}
          />

          <Metric
            title={t(
              "productivity.completed"
            )}
            value={completed}
            detail={t(
              "productivity.completionRate",
              { progress }
            )}
          />

          <Metric
            title={t(
              "productivity.categories"
            )}
            value={categories.length}
            detail={t(
              "productivity.uniqueCategories"
            )}
          />

          <div className="panel-card wide-card">
            <h3>
              {t(
                "productivity.completionProgress"
              )}
            </h3>

            <div className="large-progress">
              <span
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <strong>{progress}%</strong>
          </div>
        </div>
      )}

      {/* ==========================================
          GOALS
      ========================================== */}

      {view === "goals" && (
        <div className="panel-grid">
          <div className="panel-card wide-card">
            <h3>
              {t("goals.dailyGoal")}
            </h3>

            <p>
              {t(
                "goals.dailyGoalDescription"
              )}
            </p>

            <div className="inline-form">
              <input
                type="number"
                min="1"
                value={goal}
                onChange={(e) =>
                  setGoal(e.target.value)
                }
              />

              <button
                type="button"
                className="primary-action"
                onClick={saveGoal}
              >
                {t("goals.saveGoal")}
              </button>
            </div>

            <div className="goal-result">
              <strong>{completed}</strong>{" "}
              / {savedGoal}{" "}
              {t("goals.tasksCompleted")}
            </div>

            <div className="large-progress">
              <span
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      (completed /
                        savedGoal) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          REMINDERS
      ========================================== */}

      {view === "reminders" && (
        <div className="panel-card wide-card">
          <h3>
            {t(
              "reminders.upcomingReminders"
            )}
          </h3>

          {dueSoon.length === 0 ? (
            <EmptyPanel
              text={t(
                "reminders.noUpcoming"
              )}
            />
          ) : (
            <div className="reminder-list">
              {dueSoon.map((task) => (
                <div
                  className="reminder-row"
                  key={task.id}
                >
                  <span
                    className="priority-dot"
                    data-priority={
                      task.priority
                    }
                  />

                  <div>
                    <strong>
                      {task.text}
                    </strong>

                    <small>
                      {task.dueDate}

                      {task.category
                        ? ` · ${task.category}`
                        : ""}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          CALENDAR
      ========================================== */}

      {view === "calendar" && (
        <div className="panel-card wide-card">
          <h3>
            {t("calendar.taskCalendar")}
          </h3>

          <div className="calendar-list">
            {tasks
              .filter(
                (task) => task.dueDate
              )
              .sort((a, b) =>
                a.dueDate.localeCompare(
                  b.dueDate
                )
              )
              .map((task) => (
                <button
                  type="button"
                  key={task.id}
                  className="calendar-row"
                  onClick={() => {
                    setActiveView(
                      "tasks"
                    );
                  }}
                >
                  <time>
                    {task.dueDate}
                  </time>

                  <span
                    className={
                      task.completed
                        ? "done"
                        : ""
                    }
                  >
                    {task.text}
                  </span>

                  <em>
                    {t(
                      `priorityLabels.${task.priority}`,
                      task.priority
                    )}
                  </em>
                </button>
              ))}

            {tasks.every(
              (task) => !task.dueDate
            ) && (
              <EmptyPanel
                text={t(
                  "calendar.noDueDates"
                )}
              />
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          CATEGORIES
      ========================================== */}

      {view === "categories" && (
        <div className="panel-grid">
          {categories.length === 0 ? (
            <div className="panel-card wide-card">
              <EmptyPanel
                text={t(
                  "categories.createTaskWithCategory"
                )}
              />
            </div>
          ) : (
            categories.map((category) => {
              const count =
                tasks.filter(
                  (task) =>
                    task.category ===
                    category
                ).length;

              return (
                <button
                  type="button"
                  className="category-card"
                  key={category}
                  onClick={() => {
                    setCategoryFilter(
                      category
                    );

                    setActiveView(
                      "tasks"
                    );
                  }}
                >
                  <span>#</span>

                  <strong>
                    {category}
                  </strong>

                  <small>
                    {count}{" "}
                    {count === 1
                      ? t(
                          "categories.task"
                        )
                      : t(
                          "categories.tasks"
                        )}
                  </small>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* ==========================================
          SYNC CENTER
      ========================================== */}

      {view === "sync" && (
        <div className="panel-grid">
          <Metric
            title={t("sync.connection")}
            value={
              isOnline
                ? t("online")
                : t("offline")
            }
            detail={
              isOnline
                ? t(
                    "sync.backendAvailable"
                  )
                : t(
                    "sync.checkConnection"
                  )
            }
          />

          <Metric
            title={t(
              "sync.tasksSynced"
            )}
            value={tasks.length}
            detail={t(
              "sync.loadedThroughRtk"
            )}
          />

          <div className="panel-card wide-card">
            <h3>
              {t("sync.syncNow")}
            </h3>

            <p>
              {t(
                "sync.refreshDescription"
              )}
            </p>

            <button
              type="button"
              className="primary-action"
              onClick={() =>
                refetch()
              }
            >
              ↻{" "}
              {t("sync.refreshData")}
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          ACTIVITY FEED
      ========================================== */}

      {view === "feed" && (
        <Feed recent={recent} />
      )}

      {/* ==========================================
          WHAT'S NEW
      ========================================== */}

      {view === "whats-new" && (
        <div className="panel-card wide-card">
          <h3>
            {t("whatsNew.title")}
          </h3>

          <ul className="clean-list">
            <li>
              {t(
                "whatsNew.sidebarNavigation"
              )}
            </li>

            <li>
              {t(
                "whatsNew.smartViews"
              )}
            </li>

            <li>
              {t(
                "whatsNew.productivityGoals"
              )}
            </li>

            <li>
              {t(
                "whatsNew.calendarReminders"
              )}
            </li>

            <li>
              {t(
                "whatsNew.mobileNavigation"
              )}
            </li>
          </ul>
        </div>
      )}

      {/* ==========================================
          HELP & SUPPORT
      ========================================== */}

      {view === "help" && (
        <div className="panel-grid">
          <Metric
            title={t(
              "help.gettingStarted"
            )}
            value="1"
            detail={t(
              "help.gettingStartedDescription"
            )}
          />

          <Metric
            title={t(
              "help.keyboardFriendly"
            )}
            value="✓"
            detail={t(
              "help.keyboardDescription"
            )}
          />

          <div className="panel-card wide-card">
            <h3>
              {t("help.needMoreHelp")}
            </h3>

            <p>
              {t(
                "help.moreHelpDescription"
              )}
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          FEEDBACK
      ========================================== */}

      {view === "feedback" && (
        <div className="panel-card wide-card">
          <h3>
            {t(
              "feedback.sendFeedback"
            )}
          </h3>

          <textarea
            value={feedback}
            onChange={(e) =>
              setFeedback(
                e.target.value
              )
            }
            placeholder={t(
              "feedback.placeholder"
            )}
            rows="6"
          />

          <button
            type="button"
            className="primary-action"
            onClick={() => {
              setFeedbackSent(true);
              setFeedback("");
            }}
          >
            {t(
              "feedback.sendFeedback"
            )}
          </button>

          {feedbackSent && (
            <p className="success-note">
              {t("feedback.thanks")}
            </p>
          )}
        </div>
      )}

      {/* ==========================================
          ABOUT
      ========================================== */}

      {view === "about" && (
        <div className="panel-grid">
          <Metric
            title={t("about.app")}
            value="TaskFlow"
            detail={t(
              "about.modernWorkspace"
            )}
          />

          <Metric
            title={t("about.frontend")}
            value="React + RTK"
            detail={t(
              "about.frontendDescription"
            )}
          />

          <Metric
            title={t("about.backend")}
            value="Express"
            detail={t(
              "about.backendDescription"
            )}
          />

          <div className="panel-card wide-card">
            <h3>
              {t(
                "about.builtForLearning"
              )}
            </h3>

            <p>
              {t(
                "about.learningDescription"
              )}
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          ACCOUNT
      ========================================== */}

      {view === "account" && (
        <div className="panel-grid">
          <div className="panel-card wide-card">
            <h3>
              {t("account.profile")}
            </h3>

            <div className="profile-detail">
              <span>
                {t("profile.name")}
              </span>

              <strong>
                {currentUser?.name ||
                  t(
                    "account.notProvided"
                  )}
              </strong>
            </div>

            <div className="profile-detail">
              <span>
                {t("profile.email")}
              </span>

              <strong>
                {currentUser?.email ||
                  t(
                    "account.notProvided"
                  )}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          THEME
      ========================================== */}

      {view === "theme" && (
        <div className="panel-card wide-card">
          <h3>
            {t("theme.appearance")}
          </h3>

          <p>
            {t("theme.description")}
          </p>

          <div className="choice-row">
            <button
              type="button"
              className={
                !darkMode
                  ? "choice active"
                  : "choice"
              }
              onClick={() =>
                darkMode &&
                onToggleDarkMode()
              }
            >
              ☀{" "}
              {t("theme.light")}
            </button>

            <button
              type="button"
              className={
                darkMode
                  ? "choice active"
                  : "choice"
              }
              onClick={() =>
                !darkMode &&
                onToggleDarkMode()
              }
            >
              ◐{" "}
              {t("theme.dark")}
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          LANGUAGE
      ========================================== */}

      {view === "language" && (
        <div className="panel-card wide-card">
          <h3>
            {t("language.title")}
          </h3>

          <p>
            {t(
              "language.description"
            )}
          </p>

          <div className="choice-row">
            <button
              type="button"
              className={
                language === "en"
                  ? "choice active"
                  : "choice"
              }
              onClick={() =>
                onLanguageChange("en")
              }
            >
              {t(
                "language.english"
              )}
            </button>

            <button
              type="button"
              className={
                language === "ur"
                  ? "choice active"
                  : "choice"
              }
              onClick={() =>
                onLanguageChange("ur")
              }
            >
              {t(
                "language.urdu"
              )}
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          NOTIFICATIONS
      ========================================== */}

      {view === "notifications" && (
        <div className="panel-card wide-card">
          <h3>
            {t(
              "notifications.title"
            )}
          </h3>

          <label className="setting-row">
            <span>
              <strong>
                {t(
                  "notifications.taskCompletion"
                )}
              </strong>

              <small>
                {t(
                  "notifications.taskCompletionDescription"
                )}
              </small>
            </span>

            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) =>
                saveNotifications(
                  e.target.checked
                )
              }
            />
          </label>

          <label className="setting-row">
            <span>
              <strong>
                {t(
                  "notifications.compactList"
                )}
              </strong>

              <small>
                {t(
                  "notifications.compactListDescription"
                )}
              </small>
            </span>

            <input
              type="checkbox"
              checked={compact}
              onChange={(e) =>
                saveCompact(
                  e.target.checked
                )
              }
            />
          </label>
        </div>
      )}

      {/* ==========================================
          PRIVACY & SECURITY
      ========================================== */}

      {view === "privacy" && (
        <div className="panel-card wide-card">
          <h3>
            {t("privacy.title")}
          </h3>

          <p>
            {t(
              "privacy.demoDescription"
            )}
          </p>

          <div className="security-note">
            {t(
              "privacy.productionNote"
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ==========================================
// METRIC COMPONENT
// ==========================================

function Metric({
  title,
  value,
  detail,
}) {
  return (
    <div className="panel-card metric-panel">
      <span>{title}</span>

      <strong>{value}</strong>

      <small>{detail}</small>
    </div>
  );
}

// ==========================================
// EMPTY PANEL
// ==========================================

function EmptyPanel({ text }) {
  return (
    <p className="empty-panel">
      {text}
    </p>
  );
}

// ==========================================
// ACTIVITY FEED
// ==========================================

function Feed({ recent }) {
  const { t } = useTranslation();

  return (
    <div className="panel-card wide-card">
      <h3>
        {t("feed.recentActivity")}
      </h3>

      <div className="feed-list">
        {recent.length ? (
          recent.map((task) => (
            <div
              className="feed-row"
              key={task.id}
            >
              <span
                className={
                  task.completed
                    ? "feed-icon done"
                    : "feed-icon"
                }
              >
                {task.completed
                  ? "✓"
                  : "+"}
              </span>

              <div>
                <strong>
                  {task.text}
                </strong>

                <small>
                  {task.completed
                    ? t("feed.completed")
                    : t("feed.created")}

                  {task.category
                    ? ` · ${task.category}`
                    : ""}
                </small>
              </div>
            </div>
          ))
        ) : (
          <EmptyPanel
            text={t("feed.noFeed")}
          />
        )}
      </div>
    </div>
  );
}

export default WorkspacePanel;