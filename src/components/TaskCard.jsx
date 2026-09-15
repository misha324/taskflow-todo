import { useTranslation } from "react-i18next";

function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`task-card ${
        task.completed ? "completed" : ""
      }`}
    >
      <div className="task-main">
        <input
          type="checkbox"
          checked={Boolean(task.completed)}
          onChange={() => onToggle(task.id)}
          aria-label={t("completed")}
        />

        <div className="task-content">
          <h3>{task.text}</h3>

          <div className="task-meta">
            {task.category && (
              <span className="task-category">
                {task.category}
              </span>
            )}

            {task.priority && (
              <span
                className={`task-priority ${task.priority}`}
              >
                {t(task.priority)}
              </span>
            )}

            {task.dueDate && (
              <span className="task-date">
                {t("dueDate")}: {task.dueDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="edit-btn"
          onClick={() => onEdit(task)}
          disabled={task.completed}
        >
          {t("editTask")}
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(task.id)}
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;