// Get user's onboarding data
export function getOnboardingData() {
  const data = localStorage.getItem("voiceca_onboarding");
  return data ? JSON.parse(data) : null;
}

// Check if user has completed onboarding
export function hasCompletedOnboarding() {
  return localStorage.getItem("voiceca_hasOnboarded") === "true";
}

// Get greeting based on business type and time
export function getGreeting(businessName) {
  const hour = new Date().getHours();
  let timeGreeting = "Good morning";
  if (hour >= 12 && hour < 18) timeGreeting = "Good afternoon";
  if (hour >= 18) timeGreeting = "Good evening";

  return `${timeGreeting}, ${businessName}! 👋`;
}

// Get suggested categories based on business type
export function getSuggestedCategories(businessType) {
  const categories = {
    retail: [
      "Daily Sales",
      "Inventory Purchase",
      "Rent/Lease",
      "Staff Salaries",
      "Utilities (Electricity, Water)",
      "Transport/Delivery",
      "Shop Maintenance",
    ],
    manufacturing: [
      "Raw Material",
      "Labour/Wages",
      "Rent/Factory Space",
      "Equipment Maintenance",
      "Utilities",
      "Transport",
      "Quality Control",
    ],
    services: [
      "Service Income",
      "Walk-in Income",
      "Staff Salary",
      "Supplies",
      "Rent",
      "Utilities",
      "Equipment",
    ],
    b2b: [
      "Sales/Invoice",
      "COGS (Cost of Goods)",
      "Staff Salary",
      "Office Rent",
      "Utilities",
      "Transport",
      "Professional Services",
    ],
    freelancer: [
      "Project Income",
      "Client Retainer",
      "Office Rent",
      "Internet/Utilities",
      "Equipment/Software",
      "Training",
      "Travel",
    ],
    ecommerce: [
      "Online Sales",
      "Platform Fees",
      "Inventory Purchase",
      "Packaging/Shipping",
      "Website Hosting",
      "Marketing",
      "Returns/Refunds",
    ],
  };

  return categories[businessType] || categories.retail;
}

// Get key metrics to show based on business type
export function getKeyMetrics(businessType) {
  const metrics = {
    retail: ["Daily Sales", "Expense Breakdown", "Profit Margin", "Top Expenses"],
    manufacturing: ["Production Cost", "Labour %", "Inventory Turns", "Margin"],
    services: ["Service Revenue", "Staff Cost %", "Utilization", "Profit"],
    b2b: ["Invoice Total", "Outstanding Receivables", "Margin", "Customer Mix"],
    freelancer: ["Monthly Income", "Project Pipeline", "Tax Liability", "Deductions"],
    ecommerce: ["Daily Sales", "Platform Fees", "Inventory Value", "Return Rate"],
  };

  return metrics[businessType] || metrics.retail;
}

// Get personalized tips based on business type
export function getPersonalizedTips(businessType) {
  const tips = {
    retail: [
      "Pro tip: Log inventory purchases immediately (18% GST, claim as 80C deduction)",
      "Hack: Batch sales entries—'Sales Mon-Fri: ₹12,000' faster than daily",
      "Alert: You haven't logged rent this month—due by 5th",
      "Tax saving: Staff salaries are fully deductible (0% GST)",
    ],
    manufacturing: [
      "Pro tip: Raw material costs are your biggest deduction (80C)",
      "Compliance: Keep supplier invoices—GST return needs them",
      "Hack: Log material purchases with batch numbers for inventory tracking",
      "Tax saving: Equipment depreciation—discuss with CA for maximization",
    ],
    services: [
      "Pro tip: Service income from named clients helps track profitability",
      "Compliance: Collect PAN from clients paying >₹20K/year",
      "Hack: Set service list once, then just say client name + service",
      "Tax saving: Professional development is 100% deductible (80D)",
    ],
    b2b: [
      "Pro tip: Invoice-based income is deductible (80C). Always log invoice #",
      "Compliance: GST needed if you cross ₹40L/year revenue",
      "Hack: Track 'days to payment' for each client—spot slow payers",
      "Tax saving: Business entertainment is partially deductible",
    ],
    freelancer: [
      "Pro tip: Office setup costs are 100% deductible (Section 80C, up to ₹1.5L)",
      "Tax hack: Software subscriptions are fully deductible",
      "Compliance: Track invoice numbers—GST return needs them if >₹40L",
      "Alert: At ₹50K/month, you're close to GST threshold. Plan ahead.",
    ],
    ecommerce: [
      "Pro tip: Platform fees (Flipkart, Amazon %) are fully deductible",
      "Compliance: GST varies by product (0%-28%). Log correctly.",
      "Hack: Group daily sales by platform for easier reconciliation",
      "Tax saving: Packaging and shipping costs are deductible",
    ],
  };

  return tips[businessType] || tips.retail;
}

// Get suggested reminders based on frequency
export function getReminders(frequency, businessName) {
  const reminders = {
    daily: [
      { time: "09:00", message: `Log today's sales?` },
      { time: "18:00", message: `End of day summary for ${businessName}` },
    ],
    weekly: [
      { time: "Sunday 19:00", message: `Weekly review: ${businessName}'s profit check` },
      { time: "Friday 17:00", message: `Ready for weekend accounting?` },
    ],
    monthly: [
      { time: "1st", message: `Monthly accounting review for ${businessName}` },
      { time: "15th", message: `Halfway through month—tax check?` },
      { time: "25th", message: `GST return prep starting...` },
    ],
  };

  return reminders[frequency] || reminders.weekly;
}

// Get dashboard layout based on pain points
export function getDashboardLayout(painPoints) {
  const layout = {
    profit: ["Financial Summary", "Profit Chart", "Category Breakdown"],
    tax: ["Tax Liability Card", "Deduction Tracker", "GST Return Prep"],
    paperwork: ["Quick Entry", "Document Scanner", "Receipt Manager"],
    credit: ["Credit Tracker", "Outstanding Receivables", "Payment Reminders"],
    accountant: ["Tax Savings Card", "Deduction Maximizer", "Compliance Calendar"],
    mobile: ["Quick Add Button", "Voice Priority", "Mobile Optimized"],
  };

  const defaultLayout = ["Financial Summary", "Quick Actions", "Recent Entries"];
  let finalLayout = [...defaultLayout];

  painPoints.forEach((pain) => {
    if (layout[pain]) {
      finalLayout = [...new Set([...finalLayout, ...layout[pain]])];
    }
  });

  return finalLayout;
}

// Get language-specific confirmations
export function getConfirmation(type, language) {
  const confirmations = {
    credit_entry: {
      Hindi: "✅ Credit entry logged",
      Hinglish: "✅ Credit entry save ho gaya",
      English: "✅ Credit entry saved",
    },
    expense: {
      Hindi: "✅ Expense record ho gaya",
      Hinglish: "✅ Expense note kiya gaya",
      English: "✅ Expense recorded",
    },
    insurance_claim: {
      Hindi: "✅ Claim entry save ho gaya",
      Hinglish: "✅ Claim register ho gaya",
      English: "✅ Claim logged",
    },
  };

  return confirmations[type]?.[language] || "✅ Entry saved";
}

// Calculate personalized metrics
export function calculateMetrics(entries, businessType) {
  let totalIncome = 0;
  let totalExpense = 0;
  let totalGST = 0;
  let totalDeductible = 0;

  entries.forEach((entry) => {
    const amount = entry.entities?.amount_total || entry.entities?.amount || 0;
    const baseAmount = entry.entities?.amount_base || amount;

    if (entry.type === "credit_entry") {
      totalIncome += amount;
    } else if (entry.type === "expense") {
      totalExpense += amount;
      totalGST += entry.entities?.gst_amount || 0;
      if (entry.entities?.deduction_eligible) {
        totalDeductible += baseAmount;
      }
    }
  });

  const profit = totalIncome - totalExpense;
  const estimatedTax = totalDeductible * 0.30;

  return {
    totalIncome,
    totalExpense,
    profit,
    totalGST,
    totalDeductible,
    estimatedTax,
    profitMargin: totalIncome > 0 ? (profit / totalIncome) * 100 : 0,
  };
}
