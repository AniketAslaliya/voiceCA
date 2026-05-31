// GST Slabs for different categories
const GST_CATEGORIES = {
  "Office supplies": 0.18,
  "Travel": 0.05, // conservative, varies
  "Materials": 0.12, // conservative, varies by type
  "Salaries": 0.0,
  "Utilities": 0.05,
  "Professional services": 0.18,
  "Advertisement": 0.18,
  "Maintenance": 0.18,
  "Insurance": 0.18,
  "default": 0.18,
};

const DEDUCTION_RULES = {
  "Office supplies": { section: "80C", limit: 500000 },
  "Travel": { section: "80TTA", limit: "unlimited" },
  "Materials": { section: "80C", limit: 500000 },
  "Salaries": { section: "direct", limit: "unlimited" },
  "Professional services": { section: "80D", limit: 50000 },
  "Insurance": { section: "80D", limit: 50000 },
};

function calculateGST(amount, gstSlab) {
  const slab = gstSlab || 0.18;
  const gstAmount = Math.round(amount * slab * 100) / 100;
  return {
    amount_base: amount,
    gst_slab: `${Math.round(slab * 100)}%`,
    gst_amount: gstAmount,
    amount_total: amount + gstAmount,
  };
}

function getDeductionInfo(category) {
  const rule = DEDUCTION_RULES[category] || { section: "none", limit: 0 };
  return {
    eligible: true,
    section: rule.section,
    limit: rule.limit,
  };
}

function estimateTaxImpact(entry) {
  // Simple estimation: saved tax = deductible amount * avg tax rate (30%)
  if (!entry.entities.deduction_eligible) return null;
  const deductibleAmount = entry.entities.amount_base || 0;
  const estimatedSavings = Math.round(deductibleAmount * 0.30); // 30% avg tax rate
  return `₹${estimatedSavings} tax savings possible`;
}

function categorizeExpense(description) {
  const desc = description.toLowerCase();
  if (desc.includes("office") || desc.includes("stationery")) return "Office supplies";
  if (desc.includes("travel") || desc.includes("taxi") || desc.includes("fuel")) return "Travel";
  if (desc.includes("material") || desc.includes("raw")) return "Materials";
  if (desc.includes("salary") || desc.includes("wage")) return "Salaries";
  if (desc.includes("electric") || desc.includes("water")) return "Utilities";
  if (desc.includes("professional") || desc.includes("consultant")) return "Professional services";
  if (desc.includes("ad") || desc.includes("marketing")) return "Advertisement";
  if (desc.includes("repair") || desc.includes("maintenance")) return "Maintenance";
  if (desc.includes("insurance")) return "Insurance";
  return "Other";
}

module.exports = {
  calculateGST,
  getDeductionInfo,
  estimateTaxImpact,
  categorizeExpense,
  GST_CATEGORIES,
  DEDUCTION_RULES,
};
