const typeConfig = {
  credit_entry: { icon: "💰", label: "Udhaari Entry", color: "#22c55e" },
  insurance_claim: { icon: "📋", label: "Claim Logged", color: "#3b82f6" },
  expense: { icon: "🧾", label: "Expense Recorded", color: "#f59e0b" },
  clarification_needed: { icon: "🤔", label: "Thoda aur batao", color: "#a3a3a3" },
};

export default function OutputCard({ data, onSave, saved }) {
  if (!data) return null;

  const config = typeConfig[data.type] || {
    icon: "📌",
    label: "VoiceCA Result",
    color: "var(--text-secondary)",
  };

  return (
    <article
      className="card fade-up"
      style={{
        padding: 16,
        display: "grid",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: config.color }}>
        <span style={{ fontSize: 22 }}>{config.icon}</span>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{config.label}</span>
      </div>

      <div>
        <p style={{ color: "var(--text-primary)", fontSize: 18, lineHeight: 1.35 }}>
          {data.confirmation_hindi || "Entry samajh li gayi."}
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.45, marginTop: 4 }}>
          {data.confirmation_english || "VoiceCA created a structured result."}
        </p>
      </div>

      <pre
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          color: "var(--text-secondary)",
          padding: 12,
          fontSize: 12,
          lineHeight: 1.5,
          overflowX: "auto",
        }}
      >
        {JSON.stringify(data.entities || {}, null, 2)}
      </pre>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ color: "var(--accent)", fontSize: 13, lineHeight: 1.35 }}>
          → {data.action_required || "Ready to save"}
        </span>
        {onSave && (
          <button className="btn-primary" type="button" onClick={onSave} disabled={saved}>
            {saved ? "Saved" : "Save"}
          </button>
        )}
      </div>
    </article>
  );
}
