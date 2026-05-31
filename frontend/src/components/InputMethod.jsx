import { useState } from "react";
import { interpret } from "../lib/api";
import { showToast } from "./Toast";

export default function InputMethod({ onResult, onSaving }) {
  const [method, setMethod] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    "Office Supplies",
    "Travel",
    "Salaries",
    "Inventory",
    "Utilities",
    "Rent",
    "Equipment",
    "Other",
  ];

  // Handle form submission
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
      showToast("Error processing entry: " + error.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle quick steps
  const handleQuickStep = async (step) => {
    setLoading(true);
    try {
      const result = await interpret(step.transcript);
      onResult(result);
      setMethod(null);
    } catch (error) {
      showToast("Error processing entry: " + error.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const quickSteps = [
    {
      emoji: "💰",
      title: "Quick Sale",
      transcript: "Sold goods today for 5000 rupees",
    },
    {
      emoji: "🛍️",
      title: "Bought Stock",
      transcript: "Purchased inventory for 10000 rupees today",
    },
    {
      emoji: "👤",
      title: "Customer Credit",
      transcript: "Customer owes 2000 rupees for goods sold on credit",
    },
    {
      emoji: "⚡",
      title: "Bills Paid",
      transcript: "Paid electricity bill 1500 rupees",
    },
  ];

  // Main view - choose input method
  if (!method) {
    return (
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            How would you like to add an entry?
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {/* Voice Button */}
          <button
            onClick={() => setMethod("voice")}
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(255,255,255,0.02))",
              border: "2px solid rgba(74, 222, 128, 0.2)",
              borderRadius: "var(--radius-lg)",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "grid",
              gap: 8,
              alignItems: "center",
              justifyItems: "center",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(74, 222, 128, 0.05))";
              e.target.style.boxShadow = "0 8px 20px rgba(74, 222, 128, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(74, 222, 128, 0.2)";
              e.target.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(255,255,255,0.02))";
              e.target.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: 28 }}>🎤</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Voice</span>
          </button>

          {/* Form Button */}
          <button
            onClick={() => setMethod("form")}
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(255,255,255,0.02))",
              border: "2px solid rgba(74, 222, 128, 0.2)",
              borderRadius: "var(--radius-lg)",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "grid",
              gap: 8,
              alignItems: "center",
              justifyItems: "center",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(74, 222, 128, 0.05))";
              e.target.style.boxShadow = "0 8px 20px rgba(74, 222, 128, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(74, 222, 128, 0.2)";
              e.target.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(255,255,255,0.02))";
              e.target.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: 28 }}>📝</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Form</span>
          </button>

          {/* Quick Steps Button */}
          <button
            onClick={() => setMethod("steps")}
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(255,255,255,0.02))",
              border: "2px solid rgba(74, 222, 128, 0.2)",
              borderRadius: "var(--radius-lg)",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "grid",
              gap: 8,
              alignItems: "center",
              justifyItems: "center",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(74, 222, 128, 0.05))";
              e.target.style.boxShadow = "0 8px 20px rgba(74, 222, 128, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(74, 222, 128, 0.2)";
              e.target.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(255,255,255,0.02))";
              e.target.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: 28 }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Quick</span>
          </button>
        </div>
      </div>
    );
  }

  // Form view
  if (method === "form") {
    return (
      <form onSubmit={handleFormSubmit} style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Amount (₹)
            </span>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter amount"
              style={{ padding: "12px 14px" }}
              required
            />
          </label>
        </div>

        <div>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Category
            </span>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              style={{ padding: "12px 14px" }}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Notes (optional)
            </span>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any details..."
              style={{
                padding: "12px 14px",
                minHeight: "80px",
                fontFamily: "Poppins",
                background: "var(--bg-secondary)",
                border: "2px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                resize: "vertical",
              }}
            />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button
            type="button"
            onClick={() => setMethod(null)}
            style={{
              padding: "12px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontWeight: 600,
            }}
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            style={{
              padding: "12px 16px",
              background: "linear-gradient(180deg, #78f5a1, var(--accent))",
              border: "none",
              borderRadius: "var(--radius-full)",
              color: "#041009",
              cursor: "pointer",
              fontWeight: 700,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Entry"}
          </button>
        </div>
      </form>
    );
  }

  // Quick steps view
  if (method === "steps") {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 4 }}>
          Choose a quick template:
        </p>
        {quickSteps.map((step) => (
          <button
            key={step.title}
            onClick={() => handleQuickStep(step)}
            disabled={loading}
            style={{
              padding: "16px",
              background: "linear-gradient(135deg, rgba(74, 222, 128, 0.08), rgba(255,255,255,0.02))",
              border: "2px solid rgba(74, 222, 128, 0.15)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "flex",
              gap: 12,
              alignItems: "center",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.12), rgba(74, 222, 128, 0.04))";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(74, 222, 128, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(74, 222, 128, 0.15)";
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.08), rgba(255,255,255,0.02))";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: 24 }}>{step.emoji}</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{step.title}</span>
          </button>
        ))}

        <button
          onClick={() => setMethod(null)}
          style={{
            padding: "12px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-full)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          Back
        </button>
      </div>
    );
  }
}
