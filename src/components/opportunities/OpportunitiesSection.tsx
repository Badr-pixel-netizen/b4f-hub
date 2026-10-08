import { useEffect, useState } from "react";
import type { FetchStatus, Opportunity, OpportunityType, WorkMode } from "../../types";
import OpportunityFilters from "./OpportunityFilters";
import OpportunityCard from "./OpportunityCard";

const LOAD_ERROR_MESSAGE =
  "We could not load opportunities. Please check your connection and try again.";

interface OpportunitiesSectionProps {
  onNotify: (message: string, tone: "success" | "error") => void;
}

function buildLookupTable(list: Opportunity[]): Record<number, Opportunity> {
  const table: Record<number, Opportunity> = {};
  for (const item of list) {
    table[item.id] = item;
  }
  return table;
}

function OpportunitiesSection({ onNotify }: OpportunitiesSectionProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<OpportunityType | "all">("all");
  const [workModeFilter, setWorkModeFilter] = useState<WorkMode | "all">("all");
  const [savedOnly, setSavedOnly] = useState(false);

  const [pendingApplyIds, setPendingApplyIds] = useState<number[]>([]);

  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const [historyStack, setHistoryStack] = useState<number[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  async function loadOpportunities() {
    setStatus("loading");
    try {
      const response = await fetch("/api/opportunities");
      if (!response.ok) throw new Error("failed");
      const data: Opportunity[] = await response.json();
      setOpportunities(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    loadOpportunities();
  }, []);

  const opportunitiesById = buildLookupTable(opportunities);

  function handleToggleDetail(id: number) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    if (openId !== null) {
      setHistoryStack((stack) => [...stack, openId]);
    }
    setOpenId(id);
  }

  function handleBack() {
    if (historyStack.length === 0) return;
    const previousId = historyStack[historyStack.length - 1];
    setHistoryStack((stack) => stack.slice(0, -1));
    setOpenId(previousId);
  }

  function handleToggleSaved(id: number) {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleApply(opportunity: Opportunity) {
    if (opportunity.applied || pendingApplyIds.includes(opportunity.id)) return;

    setPendingApplyIds((current) => [...current, opportunity.id]);
    try {
      const response = await fetch(`/api/opportunities/${opportunity.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applied: true }),
      });
      const data = await response.json();

      if (!response.ok) {
        onNotify(data.error ?? "Could not submit your application. Please try again.", "error");
        return;
      }

      setOpportunities((current) =>
        current.map((item) => (item.id === data.id ? data : item)),
      );
      onNotify(`Applied to ${opportunity.title}.`, "success");
    } catch {
      onNotify("Could not submit your application. Please check your connection.", "error");
    } finally {
      setPendingApplyIds((current) => current.filter((id) => id !== opportunity.id));
    }
  }

  const visibleOpportunities = opportunities.filter((opportunity) => {
    if (typeFilter !== "all" && opportunity.type !== typeFilter) return false;
    if (workModeFilter !== "all" && opportunity.workMode !== workModeFilter) return false;
    if (savedOnly && !savedIds.has(opportunity.id)) return false;

    const term = searchTerm.trim().toLowerCase();
    if (term.length > 0) {
      const matchesTitle = opportunity.title.toLowerCase().includes(term);
      const matchesCompany = opportunity.company.toLowerCase().includes(term);
      const matchesSkill = opportunity.skills.some((skill) =>
        skill.toLowerCase().includes(term),
      );
      if (!matchesTitle && !matchesCompany && !matchesSkill) return false;
    }

    return true;
  });

  const topOfStackId =
    historyStack.length > 0 ? historyStack[historyStack.length - 1] : null;
  const backToTitle = topOfStackId !== null ? opportunitiesById[topOfStackId]?.title ?? null : null;

  return (
    <section className="panel opportunities">
      <h2>Opportunities</h2>

      {status === "success" && (
        <>
          <OpportunityFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            workModeFilter={workModeFilter}
            onWorkModeChange={setWorkModeFilter}
            savedOnly={savedOnly}
            onSavedOnlyChange={setSavedOnly}
          />
          <p className="results-count">
            {visibleOpportunities.length} of {opportunities.length} opportunities shown
          </p>
        </>
      )}

      <div className="opportunity-list">
        {status === "loading" && <p className="status-message">Loading opportunities...</p>}

        {status === "error" && (
          <div className="status-message error">
            <p>{LOAD_ERROR_MESSAGE}</p>
            <button type="button" onClick={loadOpportunities}>
              Retry
            </button>
          </div>
        )}

        {status === "success" && visibleOpportunities.length === 0 && (
          <p className="status-message">No opportunities match your filters right now.</p>
        )}

        {status === "success" &&
          visibleOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isOpen={openId === opportunity.id}
              isSaved={savedIds.has(opportunity.id)}
              isApplyPending={pendingApplyIds.includes(opportunity.id)}
              backToTitle={openId === opportunity.id ? backToTitle : null}
              onToggleDetail={handleToggleDetail}
              onToggleSaved={handleToggleSaved}
              onApply={handleApply}
              onBack={handleBack}
            />
          ))}
      </div>
    </section>
  );
}

export default OpportunitiesSection;
