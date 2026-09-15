import { useTranslation } from "react-i18next";

function LoadingState() {
  const { t } = useTranslation();

  return (
    <div className="loading-state">
      <div className="loading-spinner" />

      <h2>{t("loadingTasks")}</h2>

      <p>{t("gettingTasks")}</p>
    </div>
  );
}

export default LoadingState;