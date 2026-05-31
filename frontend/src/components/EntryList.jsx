const labels = {
  credit_entry: { icon: "💰", label: "Udhaari" },
  insurance_claim: { icon: "📋", label: "Claim" },
  expense: { icon: "🧾", label: "Expense" },
};

function getPrimaryName(entry) {
  const entities = entry.entities || {};
  return (
    entities.person ||
    entities.person_name ||
    entities.client ||
    entities.vendor ||
    entities.name ||
    "Voice Entry"
  );
}

function getAmount(entry) {
  const entities = entry.entities || {};
  return entities.amount || entities.total || entities.value;
}

export default function EntryList({ entries }) {
  if (!entries.length) {
    return (
      <section
        className="card fade-up"
        style={{
          minHeight: 260,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: 28,
        }}
      >
        <div>
          <div style={{ fontSize: 42 }}>🎙️</div>
          <p style={{ color: "var(--text-primary)", marginTop: 12 }}>Abhi koi entry nahi.</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
            Boliye kuch!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ display: "grid", gap: 12 }}>
      {entries.map((entry) => {
        const config = labels[entry.type] || { icon: "📌", label: "Entry" };
        const amount = getAmount(entry);

        const entities = entry.entities || {};
        const deductionSection = entities.deduction_section;
        const gstAmount = entities.gst_amount || 0;

        return (
          <article className="card fade-up" key={entry.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
              <div style={{ display: "grid", gap: 8, flex: 1 }}>
                <div style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  <span style={{ marginRight: 8 }}>{config.icon}</span>
                  {getPrimaryName(entry)} — {config.label}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                  {amount ? `₹${amount} · ` : ""}
                  {entry.createdAt}
                </div>

                {/* Tax Info Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {gstAmount > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: "4px 8px",
                        borderRadius: 6,
                        background: "rgba(168, 85, 247, 0.1)",
                        color: "#a855f7",
                        fontWeight: 600,
                        border: "1px solid rgba(168, 85, 247, 0.2)",
                      }}
                    >
                      GST: ₹{Math.round(gstAmount)}
                    </span>
                  )}
                  {entities.deduction_eligible && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: "4px 8px",
                        borderRadius: 6,
                        background: "rgba(34, 197, 94, 0.1)",
                        color: "#22c55e",
                        fontWeight: 600,
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                      }}
                    >
                      ✓ Deductible
                      {deductionSection && deductionSection !== "none" ? ` (${deductionSection})` : ""}
                    </span>
                  )}
                  {entities.category && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: "4px 8px",
                        borderRadius: 6,
                        background: "rgba(59, 130, 246, 0.1)",
                        color: "#3b82f6",
                        fontWeight: 600,
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                    >
                      {entities.category}
                    </span>
                  )}
                </div>

                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                  {entry.action_required || "Follow-up ready"}
                </div>
              </div>
              <span style={{ color: "var(--accent)", fontSize: 22, alignSelf: "center" }}>→</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
