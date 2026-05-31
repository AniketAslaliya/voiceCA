export default function FinancialSummary({ entries }) {
  function calculateStats(entries = []) {
    let totalIncome = 0;
    let totalExpense = 0;
    let totalGST = 0;
    let totalDeductible = 0;
    const expenseByCategory = {};
    const gstByRate = { "5%": 0, "12%": 0, "18%": 0, "28%": 0, "0%": 0 };

    entries.forEach((entry) => {
      const entities = entry.entities || {};
      const amount = entities.amount_total || entities.amount || 0;
      const baseAmount = entities.amount_base || amount;

      if (entry.type === "credit_entry") {
        totalIncome += amount;
      } else if (entry.type === "expense") {
        totalExpense += amount;
        const category = entities.category || "Other";
        expenseByCategory[category] = (expenseByCategory[category] || 0) + amount;

        if (entities.deduction_eligible) {
          totalDeductible += baseAmount;
        }

        const gstSlab = entities.gst_slab || "18%";
        gstByRate[gstSlab] = (gstByRate[gstSlab] || 0) + (entities.gst_amount || 0);
        totalGST += entities.gst_amount || 0;
      }
    });

    const profit = totalIncome - totalExpense;
    const estimatedTax = totalDeductible > 0 ? Math.round(totalDeductible * 0.30) : 0;

    return {
      totalIncome,
      totalExpense,
      profit,
      totalGST,
      totalDeductible,
      estimatedTax,
      expenseByCategory,
      gstByRate,
      entriesCount: entries.length,
    };
  }

  const stats = calculateStats(entries);
  const topExpenseCategory = Object.entries(stats.expenseByCategory).sort(
    ([, a], [, b]) => b - a,
  )[0];

  if (!entries.length) {
    return (
      <section
        className="card fade-up"
        style={{
          padding: 24,
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
        <p>Entries add hone se financial summary dikhai dega.</p>
      </section>
    );
  }

  return (
    <section style={{ display: "grid", gap: 16 }}>
      {/* Main Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        <article className="card fade-up" style={{ padding: 16, background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))", borderColor: "rgba(34, 197, 94, 0.2)" }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 700 }}>TOTAL INCOME</span>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#22c55e", marginTop: 8 }}>
            ₹{stats.totalIncome.toLocaleString("en-IN")}
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
            {entries.filter((e) => e.type === "credit_entry").length} credit entries
          </span>
        </article>

        <article className="card fade-up" style={{ padding: 16, background: "linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(244, 63, 94, 0.05))", borderColor: "rgba(244, 63, 94, 0.2)" }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 700 }}>TOTAL EXPENSE</span>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#f43f5e", marginTop: 8 }}>
            ₹{stats.totalExpense.toLocaleString("en-IN")}
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
            {entries.filter((e) => e.type === "expense").length} expenses
          </span>
        </article>

        <article className="card fade-up" style={{ padding: 16, background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))", borderColor: "rgba(59, 130, 246, 0.2)" }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 700 }}>PROFIT</span>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#3b82f6", marginTop: 8 }}>
            ₹{stats.profit.toLocaleString("en-IN")}
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
            {stats.profit > 0 ? "Achcha chal raha hai!" : "Loss ho raha hai"}
          </span>
        </article>

        <article className="card fade-up" style={{ padding: 16, background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))", borderColor: "rgba(168, 85, 247, 0.2)" }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 700 }}>TAX DEDUCTIBLE</span>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#a855f7", marginTop: 8 }}>
            ₹{stats.totalDeductible.toLocaleString("en-IN")}
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
            ~₹{stats.estimatedTax.toLocaleString("en-IN")} savings
          </span>
        </article>
      </div>

      {/* GST & Category Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {/* GST Collected */}
        <article className="card fade-up" style={{ padding: 16 }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 700 }}>GST LIABILITY</span>
          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>
              ₹{stats.totalGST.toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
              {Object.entries(stats.gstByRate)
                .filter(([, amount]) => amount > 0)
                .map(([rate, amount]) => (
                  <div key={rate}>
                    {rate} slab: ₹{Math.round(amount).toLocaleString("en-IN")}
                  </div>
                ))}
            </div>
          </div>
        </article>

        {/* Top Expense Category */}
        {topExpenseCategory && (
          <article className="card fade-up" style={{ padding: 16 }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 700 }}>TOP EXPENSE CATEGORY</span>
            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#f59e0b" }}>
                {topExpenseCategory[0]}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>
                ₹{Math.round(topExpenseCategory[1]).toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {((topExpenseCategory[1] / stats.totalExpense) * 100).toFixed(1)}% of total
              </div>
            </div>
          </article>
        )}
      </div>

      {/* Expense Breakdown */}
      {Object.keys(stats.expenseByCategory).length > 0 && (
        <article className="card fade-up" style={{ padding: 16 }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 700, display: "block", marginBottom: 14 }}>
            EXPENSE BREAKDOWN
          </span>
          <div style={{ display: "grid", gap: 10 }}>
            {Object.entries(stats.expenseByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} style={{ display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{category}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      ₹{Math.round(amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "var(--border)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #3b82f6, #a855f7)",
                        width: `${(amount / stats.totalExpense) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </article>
      )}
    </section>
  );
}
