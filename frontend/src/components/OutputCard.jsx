const typeConfig = {
  credit_entry: { icon: "💰", label: "Udhaari Entry", color: "#22c55e" },
  insurance_claim: { icon: "📋", label: "Claim Logged", color: "#3b82f6" },
  expense: { icon: "🧾", label: "Expense Recorded", color: "#f59e0b" },
  clarification_needed: { icon: "🤔", label: "Thoda aur batao", color: "#a3a3a3" },
};

const entityLabels = {
  person: "Person",
  person_name: "Person",
  client: "Client",
  vendor: "Paid To",
  amount: "Amount",
  date: "Date",
  item: "Item",
  category: "Category",
  claim_type: "Claim Type",
  accident_date: "Accident Date",
  status: "Status",
};

const entityAccent = {
  person: "#4ade80",
  person_name: "#4ade80",
  client: "#38bdf8",
  vendor: "#f97316",
  amount: "#facc15",
  date: "#c084fc",
  item: "#fb7185",
  category: "#22c55e",
  claim_type: "#38bdf8",
  accident_date: "#a78bfa",
  status: "#eab308",
};

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "string") return value;
  if (typeof value === "number") return `${value}`;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return JSON.stringify(value);
}

function buildEntityPairs(entities = {}) {
  const entries = Object.entries(entities || []);
  return entries.map(([key, value]) => ({
    key,
    label: entityLabels[key] || key.replace(/_/g, " "),
    value: formatValue(value),
    accent: entityAccent[key] || "#4ade80",
  }));
}

export default function OutputCard({ data, onSave, saved }) {
  if (!data) return null;

  const config = typeConfig[data.type] || {
    icon: "📌",
    label: "VoiceCA Result",
    color: "var(--text-secondary)",
  };
  const entityPairs = buildEntityPairs(data.entities);

  return (
    <article
      className="card fade-up"
      style={{
        padding: 18,
        display: "grid",
        gap: 16,
        background:
          "linear-gradient(180deg, rgba(74, 222, 128, 0.08), rgba(17, 20, 19, 0.92) 22%, rgba(17, 20, 19, 0.96))",
        borderColor: "rgba(74, 222, 128, 0.16)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: config.color }}>
          <span style={{ fontSize: 22 }}>{config.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{config.label}</span>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            borderRadius: "var(--radius-full)",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          AI decoded
        </span>
      </div>

      <div
        style={{
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "var(--radius-md)",
          background: "rgba(0, 0, 0, 0.14)",
          padding: 16,
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <span
            style={{
              color: "var(--accent)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            Voice note understood
          </span>
          <p style={{ color: "var(--text-primary)", fontSize: 18, lineHeight: 1.4 }}>
            {data.confirmation_hindi || "Entry samajh li gayi."}
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.45 }}>
            {data.confirmation_english || "VoiceCA created a structured result."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              Extracted fields
            </span>
            <span style={{ color: config.color, fontSize: 12, fontWeight: 700 }}>
              {entityPairs.length ? `${entityPairs.length} fields` : "No fields found"}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(138px, 1fr))",
              gap: 10,
            }}
          >
            {entityPairs.length ? (
              entityPairs.map((entity) => (
                <div
                  key={entity.key}
                  style={{
                    border: `1px solid color-mix(in srgb, ${entity.accent} 28%, transparent)`,
                    background: `linear-gradient(180deg, color-mix(in srgb, ${entity.accent} 10%, transparent), rgba(255,255,255,0.03))`,
                    borderRadius: 14,
                    padding: 12,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      color: entity.accent,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {entity.label}
                  </span>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: 15,
                      lineHeight: 1.35,
                      wordBreak: "break-word",
                    }}
                  >
                    {entity.value}
                  </span>
                </div>
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  border: "1px dashed var(--border)",
                  borderRadius: 14,
                  padding: 14,
                  color: "var(--text-secondary)",
                  fontSize: 14,
                }}
              >
                VoiceCA understood the request, but there were no structured fields to show.
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: 14,
          borderRadius: "var(--radius-md)",
          background: "rgba(74, 222, 128, 0.08)",
          border: "1px solid rgba(74, 222, 128, 0.16)",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <span style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em" }}>
            Next action
          </span>
          <span style={{ color: "var(--text-primary)", fontSize: 14, lineHeight: 1.4 }}>
            {data.action_required || "Ready to save"}
          </span>
        </div>
        {onSave && (
          <button className="btn-primary" type="button" onClick={onSave} disabled={saved}>
            {saved ? "Saved" : "Save"}
          </button>
        )}
      </div>
    </article>
  );
}
