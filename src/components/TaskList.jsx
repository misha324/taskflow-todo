import { useTranslation } from "react-i18next";
import TaskCard from "./TaskCard";

function TaskList({
  tasks,
  taskListRef,
  completedTasks,
  onToggle,
  onEdit,
  onDelete,
  onClearCompleted,
}) {
  const { t } = useTranslation();

  return (
    <section className="task-list-section">
      <div className="task-list-header">
        <h2>{t("tasks")}</h2>

        <span>
          {tasks.length} {t("tasks")}
        </span>
      </div>

      <div className="task-list" ref={taskListRef}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {completedTasks > 0 && (
        <button
          type="button"
          className="clear-completed-btn"
          onClick={onClearCompleted}
        >
          {t("clearCompleted")}
        </button>
      )}
    </section>
  );
}

export default TaskList;