import { useTranslation } from "react-i18next";

function TaskControls({
  search,
  filter,
  categoryFilter,
  sortBy,
  categories,
  isPending,
  onSearch,
  onFilterChange,
  onCategoryFilterChange,
  onSortChange,
}) {
  const { t, i18n } = useTranslation();

  const direction = i18n.language === "ur" ? "rtl" : "ltr";

  return (
    <section className="controls-section" dir={direction}>
      <input
        className="search-input"
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={t("searchTasks")}
        aria-label={t("searchTasks")}
      />

      {isPending && (
        <span className="search-loading">
          {t("searching")}
        </span>
      )}

      <div className="filter-controls">
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="all">{t("allTasks")}</option>
          <option value="active">{t("active")}</option>
          <option value="completed">{t("completed")}</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) =>
            onCategoryFilterChange(e.target.value)
          }
        >
          <option value="all">{t("allCategories")}</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">{t("newest")}</option>
          <option value="oldest">{t("oldest")}</option>
          <option value="priority">{t("prioritySort")}</option>
          <option value="dueDate">{t("dueDateSort")}</option>
        </select>
      </div>
    </section>
  );
}

export default TaskControls;