import { OPPORTUNITY_TYPES, WORK_MODES } from "../../types";
import type { OpportunityType, WorkMode } from "../../types";

interface OpportunityFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: OpportunityType | "all";
  onTypeChange: (value: OpportunityType | "all") => void;
  workModeFilter: WorkMode | "all";
  onWorkModeChange: (value: WorkMode | "all") => void;
  savedOnly: boolean;
  onSavedOnlyChange: (value: boolean) => void;
}

const TYPE_LABELS: Record<OpportunityType, string> = {
  job: "Job",
  internship: "Internship",
  scholarship: "Scholarship",
  volunteer: "Volunteer",
};

const WORK_MODE_LABELS: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  "on-site": "On-site",
};

function OpportunityFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeChange,
  workModeFilter,
  onWorkModeChange,
  savedOnly,
  onSavedOnlyChange,
}: OpportunityFiltersProps) {
  return (
    <div className="opportunity-filters">
      <input
        type="text"
        className="search-input"
        placeholder="Search title, company, or skill..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <div className="filter-row">
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(event) => onTypeChange(event.target.value as OpportunityType | "all")}
        >
          <option value="all">All types</option>
          {OPPORTUNITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {TYPE_LABELS[type]}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={workModeFilter}
          onChange={(event) => onWorkModeChange(event.target.value as WorkMode | "all")}
        >
          <option value="all">All work modes</option>
          {WORK_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {WORK_MODE_LABELS[mode]}
            </option>
          ))}
        </select>

        <label className="liked-only-label">
          <input
            type="checkbox"
            checked={savedOnly}
            onChange={(event) => onSavedOnlyChange(event.target.checked)}
          />
          Saved only
        </label>
      </div>
    </div>
  );
}

export default OpportunityFilters;
