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

        return (
          <article className="card fade-up" key={entry.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  <span style={{ marginRight: 8 }}>{config.icon}</span>
                  {getPrimaryName(entry)} — {config.label}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                  {amount ? `₹${amount} · ` : ""}
                  {entry.createdAt}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                  {entry.action_required || "Follow-up ready"}
                </div>
              </div>
              <span style={{ color: "var(--accent)", fontSize: 22 }}>→</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
