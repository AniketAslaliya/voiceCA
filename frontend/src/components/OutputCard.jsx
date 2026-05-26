export default function OutputCard({ data }) {
  if (!data) return null;
  const icons = { credit_entry: "💰", insurance_claim: "📋", expense: "🧾" };

  return (
    <div style={{ border: "1px solid #16a34a", borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 24 }}>{icons[data.type] || "📌"}</div>
      <div style={{ fontWeight: "bold", marginTop: 8 }}>{data.confirmation_hindi}</div>
      <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>
        {data.confirmation_english}
      </div>
      <pre
        style={{
          background: "#f1f5f9",
          padding: 8,
          borderRadius: 8,
          fontSize: 12,
          overflowX: "auto",
          marginTop: 12,
        }}
      >
        {JSON.stringify(data.entities, null, 2)}
      </pre>
      <div style={{ color: "#16a34a", fontSize: 13 }}>
        → {data.action_required}
      </div>
    </div>
  );
}
