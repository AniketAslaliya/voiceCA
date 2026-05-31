import { useState } from "react";
import { interpret } from "../lib/api";
import { showToast } from "./Toast";

export default function InputMethod({ onResult }) {
  const [method, setMethod] = useState(null);
  const [formData, setFormData] = useState({ amount: "", category: "", description: "" });
  const [loading, setLoading] = useState(false);

  const categories = ["Office Supplies", "Travel", "Salaries", "Inventory", "Utilities", "Rent", "Equipment", "Other"];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      showToast("Please fill amount and category", "error", 2000);
      return;
    }
    setLoading(true);
    try {
      const transcript = `Spent ${formData.amount} rupees on ${formData.category}. ${formData.description}`;
      const result = await interpret(transcript);
      onResult(result);
      setMethod(null);
      setFormData({ amount: "", category: "", description: "" });
    } catch (error) {
      showToast("Error: " + error.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStep = async (transcript) => {
    setLoading(true);
    try {
      const result = await interpret(transcript);
      onResult(result);
      setMethod(null);
    } catch (error) {
      showToast("Error: " + error.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const quickSteps = [
    { emoji: "💰", title: "Quick Sale", transcript: "Sold goods today for 5000 rupees" },
    { emoji: "🛍️", title: "Bought Stock", transcript: "Purchased inventory for 10000 rupees today" },
    { emoji: "👤", title: "Customer Credit", transcript: "Customer owes 2000 rupees for goods sold on credit" },
    { emoji: "⚡", title: "Bills Paid", transcript: "Paid electricity bill 1500 rupees" },
  ];

  if (!method) {
    return (
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 500 }}>Choose how to add entry:</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button onClick={() => setMethod("form")} style={{ padding: "20px", background: "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(255,255,255,0.02))", border: "2px solid rgba(74, 222, 128, 0.2)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", cursor: "pointer", transition: "all 0.3s", display: "grid", gap: 8, alignItems: "center", justifyItems: "center" }}>
            <span style={{ fontSize: 28 }}>📝</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Form</span>
          </button>
          <button onClick={() => setMethod("steps")} style={{ padding: "20px", background: "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(255,255,255,0.02))", border: "2px solid rgba(74, 222, 128, 0.2)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", cursor: "pointer", transition: "all 0.3s", display: "grid", gap: 8, alignItems: "center", justifyItems: "center" }}>
            <span style={{ fontSize: 28 }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Quick</span>
          </button>
        </div>
      </div>
    );
  }

  if (method === "form") {
    return (
      <form onSubmit={handleFormSubmit} style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Amount (₹)</span>
            <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Enter amount" required />
          </label>
        </div>
        <div>
          <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Category</span>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
              <option value="">Select category</option>
              {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button type="button" onClick={() => setMethod(null)} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600 }} disabled={loading}>Back</button>
          <button type="submit" style={{ padding: "12px 16px", background: "linear-gradient(180deg, #78f5a1, var(--accent))", border: "none", borderRadius: "var(--radius-full)", color: "#041009", cursor: "pointer", fontWeight: 700 }} disabled={loading}>{loading ? "Processing..." : "Add"}</button>
        </div>
      </form>
    );
  }

  if (method === "steps") {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        {quickSteps.map((step) => (
          <button key={step.title} onClick={() => handleQuickStep(step.transcript)} disabled={loading} style={{ padding: "16px", background: "linear-gradient(135deg, rgba(74, 222, 128, 0.08), rgba(255,255,255,0.02))", border: "2px solid rgba(74, 222, 128, 0.15)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", cursor: "pointer", transition: "all 0.3s", display: "flex", gap: 12, alignItems: "center", opacity: loading ? 0.6 : 1 }}>
            <span style={{ fontSize: 24 }}>{step.emoji}</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{step.title}</span>
          </button>
        ))}
        <button onClick={() => setMethod(null)} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600, marginTop: 8 }}>Back</button>
      </div>
    );
  }
}
