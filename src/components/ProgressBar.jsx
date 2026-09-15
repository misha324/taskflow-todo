import { useTranslation } from "react-i18next";

function ProgressBar({ progress }) {
  const { t } = useTranslation();

  const safeProgress = Math.min(
    100,
    Math.max(0, Number(progress) || 0)
  );

  return (
    <section className="progress-section">
      <div className="progress-header">
        <span>{t("overallProgress")}</span>
        <strong>{safeProgress}%</strong>
      </div>

      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={safeProgress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-fill"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </section>
  );
}

export default ProgressBar;