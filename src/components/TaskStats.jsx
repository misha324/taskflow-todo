import { useTranslation } from "react-i18next";

function TaskStats({
  totalTasks,
  activeTasks,
  completedTasks,
  progress,
}) {
  const { t } = useTranslation();

  return (
    <section className="stats-section">
      <div className="stat-card">
        <span className="stat-number">{totalTasks}</span>
        <span className="stat-label">{t("total")}</span>
      </div>

      <div className="stat-card">
        <span className="stat-number">{activeTasks}</span>
        <span className="stat-label">{t("active")}</span>
      </div>

      <div className="stat-card">
        <span className="stat-number">{completedTasks}</span>
        <span className="stat-label">{t("completed")}</span>
      </div>

      <div className="stat-card">
        <span className="stat-number">{progress}%</span>
        <span className="stat-label">{t("progress")}</span>
      </div>
    </section>
  );
}

export default TaskStats;