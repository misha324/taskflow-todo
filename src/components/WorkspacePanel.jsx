import { useMemo, useState } from "react";

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
  const [goal, setGoal] = useState(() => localStorage.getItem("todoGoal") || "10");
  const [savedGoal, setSavedGoal] = useState(() => Number(localStorage.getItem("todoGoal") || 10));
  const [notifications, setNotifications] = useState(() => localStorage.getItem("todoNotifications") !== "false");
  const [compact, setCompact] = useState(() => localStorage.getItem("todoCompact") === "true");
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const completed = tasks.filter((task) => task.completed).length;
  const active = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const today = new Date().toLocaleDateString("en-CA");

  const dueSoon = useMemo(() => {
    return tasks
      .filter((task) => !task.completed && task.dueDate)
      .filter((task) => task.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }, [tasks, today]);

  const recent = useMemo(() => [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6), [tasks]);

  const saveGoal = () => {
    const value = Math.max(1, Number(goal) || 1);
    localStorage.setItem("todoGoal", String(value));
    setSavedGoal(value);
  };

  const saveNotifications = (value) => {
    setNotifications(value);
    localStorage.setItem("todoNotifications", String(value));
  };

  const saveCompact = (value) => {
    setCompact(value);
    localStorage.setItem("todoCompact", String(value));
  };

  if (["dashboard", "tasks", "today", "important", "upcoming", "completed"].includes(view)) {
    return null;
  }

  const titleMap = {
    productivity: "Productivity",
    goals: "Goals",
    reminders: "Reminders",
    calendar: "Calendar",
    categories: "Categories",
    sync: "Sync Center",
    feed: "Activity Feed",
    "whats-new": "What's New",
    help: "Help & Support",
    feedback: "Feedback",
    about: "About TaskFlow",
    account: "Account Settings",
    theme: "Theme",
    language: "Language",
    notifications: "Notifications",
    privacy: "Privacy & Security",
  };

  const title = titleMap[view] || "TaskFlow";

  return (
    <section className="workspace-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">TaskFlow</span>
          <h2>{title}</h2>
          <p>Everything you need to stay organized, in one place.</p>
        </div>
      </div>

      {view === "productivity" && (
        <div className="panel-grid">
          <Metric title="Total tasks" value={tasks.length} detail="All tasks for this account" />
          <Metric title="Active" value={active} detail="Tasks still in progress" />
          <Metric title="Completed" value={completed} detail={`${progress}% completion rate`} />
          <Metric title="Categories" value={categories.length} detail="Unique categories in use" />
          <div className="panel-card wide-card">
            <h3>Completion progress</h3>
            <div className="large-progress"><span style={{ width: `${progress}%` }} /></div>
            <strong>{progress}%</strong>
          </div>
        </div>
      )}

      {view === "goals" && (
        <div className="panel-grid">
          <div className="panel-card wide-card">
            <h3>Daily completion goal</h3>
            <p>Set how many tasks you want to complete as your daily target.</p>
            <div className="inline-form">
              <input type="number" min="1" value={goal} onChange={(e) => setGoal(e.target.value)} />
              <button type="button" className="primary-action" onClick={saveGoal}>Save goal</button>
            </div>
            <div className="goal-result"><strong>{completed}</strong> / {savedGoal} tasks completed</div>
            <div className="large-progress"><span style={{ width: `${Math.min(100, Math.round((completed / savedGoal) * 100))}%` }} /></div>
          </div>
        </div>
      )}

      {view === "reminders" && (
        <div className="panel-card wide-card">
          <h3>Upcoming reminders</h3>
          {dueSoon.length === 0 ? <EmptyPanel text="No upcoming due dates. Add a due date to a task to see reminders here." /> : (
            <div className="reminder-list">{dueSoon.map((task) => <div className="reminder-row" key={task.id}><span className="priority-dot" data-priority={task.priority} /><div><strong>{task.text}</strong><small>{task.dueDate}{task.category ? ` · ${task.category}` : ""}</small></div></div>)}</div>
          )}
        </div>
      )}

      {view === "calendar" && (
        <div className="panel-card wide-card">
          <h3>Task calendar</h3>
          <div className="calendar-list">
            {tasks.filter((task) => task.dueDate).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((task) => (
              <button type="button" key={task.id} className="calendar-row" onClick={() => { setActiveView("tasks"); }}>
                <time>{task.dueDate}</time><span className={task.completed ? "done" : ""}>{task.text}</span><em>{task.priority}</em>
              </button>
            ))}
            {tasks.every((task) => !task.dueDate) && <EmptyPanel text="No tasks have due dates yet." />}
          </div>
        </div>
      )}

      {view === "categories" && (
        <div className="panel-grid">
          {categories.length === 0 ? <div className="panel-card wide-card"><EmptyPanel text="Create a task with a category to start organizing your work." /></div> : categories.map((category) => {
            const count = tasks.filter((task) => task.category === category).length;
            return <button type="button" className="category-card" key={category} onClick={() => { setCategoryFilter(category); setActiveView("tasks"); }}><span>#</span><strong>{category}</strong><small>{count} task{count === 1 ? "" : "s"}</small></button>;
          })}
        </div>
      )}

      {view === "sync" && (
        <div className="panel-grid">
          <Metric title="Connection" value={isOnline ? "Online" : "Offline"} detail={isOnline ? "Backend connection can be used." : "Check your network and backend server."} />
          <Metric title="Tasks synced" value={tasks.length} detail="Loaded through RTK Query" />
          <div className="panel-card wide-card"><h3>Sync now</h3><p>Refresh the task collection from the backend database.</p><button type="button" className="primary-action" onClick={() => refetch()}>↻ Refresh data</button></div>
        </div>
      )}

      {view === "feed" && <Feed recent={recent} />}
      {view === "whats-new" && <div className="panel-card wide-card"><h3>What's new</h3><ul className="clean-list"><li>Professional sidebar navigation</li><li>Today, Important, Upcoming and Completed smart views</li><li>Productivity and goal tracking</li><li>Calendar, reminders and category management</li><li>Responsive mobile navigation and polished dashboard interactions</li></ul></div>}
      {view === "help" && <div className="panel-grid"><Metric title="Getting started" value="1" detail="Create a task, choose a priority and category, then add a due date when needed." /><Metric title="Keyboard friendly" value="✓" detail="All navigation controls are standard buttons and form fields." /><div className="panel-card wide-card"><h3>Need more help?</h3><p>Check the task filters first. If data does not load, open Sync Center and verify that the backend is running on port 5000.</p></div></div>}
      {view === "feedback" && <div className="panel-card wide-card"><h3>Send feedback</h3><textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tell us what you would improve..." rows="6" /><button type="button" className="primary-action" onClick={() => { setFeedbackSent(true); setFeedback(""); }}>Send feedback</button>{feedbackSent && <p className="success-note">Thanks — your feedback was saved for this session.</p>}</div>}
      {view === "about" && <div className="panel-grid"><Metric title="App" value="TaskFlow" detail="Modern React productivity workspace" /><Metric title="Frontend" value="React + RTK" detail="Redux Toolkit and RTK Query" /><Metric title="Backend" value="Express" detail="SQLite-powered REST API" /><div className="panel-card wide-card"><h3>Built for learning</h3><p>This project demonstrates modern React, state management, API data fetching, reusable components, routing and responsive UI patterns.</p></div></div>}

      {view === "account" && <div className="panel-grid"><div className="panel-card wide-card"><h3>Profile</h3><div className="profile-detail"><span>Name</span><strong>{currentUser?.name || "Not provided"}</strong></div><div className="profile-detail"><span>Email</span><strong>{currentUser?.email || "Not provided"}</strong></div></div></div>}

      {view === "theme" && <div className="panel-card wide-card"><h3>Appearance</h3><p>Choose the visual mode for your workspace.</p><div className="choice-row"><button type="button" className={!darkMode ? "choice active" : "choice"} onClick={() => darkMode && onToggleDarkMode()}>☀ Light</button><button type="button" className={darkMode ? "choice active" : "choice"} onClick={() => !darkMode && onToggleDarkMode()}>◐ Dark</button></div></div>}

      {view === "language" && <div className="panel-card wide-card"><h3>Language</h3><p>Switch between the supported workspace languages.</p><div className="choice-row"><button type="button" className={language === "en" ? "choice active" : "choice"} onClick={() => onLanguageChange("en")}>English</button><button type="button" className={language === "ur" ? "choice active" : "choice"} onClick={() => onLanguageChange("ur")}>اردو</button></div></div>}

      {view === "notifications" && <div className="panel-card wide-card"><h3>Notifications</h3><label className="setting-row"><span><strong>Task completion notifications</strong><small>Show a confirmation when a task is completed.</small></span><input type="checkbox" checked={notifications} onChange={(e) => saveNotifications(e.target.checked)} /></label><label className="setting-row"><span><strong>Compact task list</strong><small>Reduce spacing in the task list.</small></span><input type="checkbox" checked={compact} onChange={(e) => saveCompact(e.target.checked)} /></label></div>}

      {view === "privacy" && <div className="panel-card wide-card"><h3>Privacy & Security</h3><p>Your current demo authentication stores account data locally in the browser. Do not use real passwords in this learning build.</p><div className="security-note">For a production release, move authentication to the backend, hash passwords and use secure sessions or tokens.</div></div>}
    </section>
  );
}

function Metric({ title, value, detail }) {
  return <div className="panel-card metric-panel"><span>{title}</span><strong>{value}</strong><small>{detail}</small></div>;
}

function EmptyPanel({ text }) { return <p className="empty-panel">{text}</p>; }

function Feed({ recent }) {
  return <div className="panel-card wide-card"><h3>Recent activity</h3><div className="feed-list">{recent.length ? recent.map((task) => <div className="feed-row" key={task.id}><span className={task.completed ? "feed-icon done" : "feed-icon"}>{task.completed ? "✓" : "+"}</span><div><strong>{task.text}</strong><small>{task.completed ? "Completed" : "Created"}{task.category ? ` · ${task.category}` : ""}</small></div></div>) : <EmptyPanel text="No activity yet." />}</div></div>;
}

export default WorkspacePanel;
