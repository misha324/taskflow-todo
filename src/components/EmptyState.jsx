import { useTranslation } from "react-i18next";

function EmptyState({ search = "", filter = "all" }) {
  const { t } = useTranslation();

  const hasSearch = search.trim().length > 0;
  const isFiltered = filter !== "all";

  return (
    <div className="empty-state">
      <h2>{t("noTasksFound")}</h2>

      <p>
        {hasSearch || isFiltered
          ? t("noTasksDescription")
          : t("noTasksDescription")}
      </p>
    </div>
  );
}

export default EmptyState;