
import { useTranslation } from "react-i18next";

function TaskForm({
  taskText,
  dueDate,
  priority,
  category,
  editId,
  taskInputId,
  dueDateId,
  priorityId,
  categoryId,
  taskMessage,
  formError,
  isPending,
  onTaskTextChange,
  onDueDateChange,
  onPriorityChange,
  onCategoryChange,
  onSubmit,
  onCancel,
  taskInputRef,
}) {
  const { t, i18n } = useTranslation();

  const direction = i18n.language === "ur" ? "rtl" : "ltr";

  return (
    <section className="task-form-section">
      <h2>{editId ? t("editTask") : t("addTask")}</h2>

      <form
        className="task-form"
        onSubmit={onSubmit}
        dir={direction}
      >
        <div className="form-row">
          {/* Task */}
          <div className="form-group">
            <label htmlFor={taskInputId}>{t("task")}</label>

            <input
              id={taskInputId}
              name="taskText"
              ref={taskInputRef}
              type="text"
              value={taskText}
              onChange={(e) => onTaskTextChange(e.target.value)}
              placeholder={t("enterTask")}
              autoComplete="off"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor={categoryId}>{t("category")}</label>

            <input
              id={categoryId}
              name="category"
              type="text"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              placeholder={t("categoryPlaceholder")}
              autoComplete="off"
            />
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label htmlFor={dueDateId}>{t("dueDate")}</label>

            <input
              id={dueDateId}
              name="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor={priorityId}>{t("priority")}</label>

            <select
              id={priorityId}
              name="priority"
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value)}
            >
              <option value="low">{t("low")}</option>
              <option value="medium">{t("medium")}</option>
              <option value="high">{t("high")}</option>
            </select>
          </div>
        </div>

        {/* Success Message */}
        {taskMessage && (
          <div className="success-message">
            {taskMessage}
          </div>
        )}

        {/* Error Message */}
        {formError && (
          <div className="error-message">
            {formError}
          </div>
        )}

        {/* Buttons */}
        <div className="form-buttons">
          <button
            type="submit"
            className="add-task-btn"
            disabled={isPending}
          >
            {isPending
              ? t("saving")
              : editId
              ? t("updateTask")
              : t("addTask")}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
              disabled={isPending}
            >
              {t("cancel")}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
