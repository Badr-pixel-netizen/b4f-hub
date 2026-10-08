import type { Opportunity } from "../../types";
import { formatDate } from "../../utils/time";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isOpen: boolean;
  isSaved: boolean;
  isApplyPending: boolean;
  backToTitle: string | null;
  onToggleDetail: (id: number) => void;
  onToggleSaved: (id: number) => void;
  onApply: (opportunity: Opportunity) => void;
  onBack: () => void;
}

const TYPE_LABELS: Record<Opportunity["type"], string> = {
  job: "Job",
  internship: "Internship",
  scholarship: "Scholarship",
  volunteer: "Volunteer",
};

const WORK_MODE_LABELS: Record<Opportunity["workMode"], string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  "on-site": "On-site",
};

function OpportunityCard({
  opportunity,
  isOpen,
  isSaved,
  isApplyPending,
  backToTitle,
  onToggleDetail,
  onToggleSaved,
  onApply,
  onBack,
}: OpportunityCardProps) {
  return (
    <article className="opportunity-card">
      <div className="opportunity-card-header">
        <div className="opportunity-logo">{opportunity.companyLogo}</div>
        <div className="opportunity-title-block">
          <span className="opportunity-title">{opportunity.title}</span>
          <span className="opportunity-company">{opportunity.company}</span>
        </div>
        <button
          type="button"
          className={`save-toggle ${isSaved ? "saved" : ""}`}
          onClick={() => onToggleSaved(opportunity.id)}
          aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
        >
          {isSaved ? "\u2605" : "\u2606"}
        </button>
      </div>

      <div className="opportunity-tags">
        <span className={`badge badge-type-${opportunity.type}`}>
          {TYPE_LABELS[opportunity.type]}
        </span>
        <span className="tag">{WORK_MODE_LABELS[opportunity.workMode]}</span>
        <span className="tag">{opportunity.location}</span>
      </div>

      <div className="opportunity-skills">
        {opportunity.skills.map((skill) => (
          <span key={skill} className="skill-chip">
            {skill}
          </span>
        ))}
      </div>

      {isOpen && (
        <div className="opportunity-detail">
          {backToTitle && (
            <button type="button" className="back-link" onClick={onBack}>
              &larr; Back to {backToTitle}
            </button>
          )}
          <p className="opportunity-description">{opportunity.description}</p>
          <p className="opportunity-deadline">Apply by {formatDate(opportunity.deadline)}</p>
        </div>
      )}

      <div className="opportunity-actions">
        <button
          type="button"
          className="detail-toggle"
          onClick={() => onToggleDetail(opportunity.id)}
        >
          {isOpen ? "Hide details" : "View details"}
        </button>
        <button
          type="button"
          className={`apply-button ${opportunity.applied ? "applied" : ""}`}
          disabled={opportunity.applied || isApplyPending}
          onClick={() => onApply(opportunity)}
        >
          {opportunity.applied ? "Applied" : isApplyPending ? "Applying..." : "Apply"}
        </button>
      </div>
    </article>
  );
}

export default OpportunityCard;
