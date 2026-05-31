// Demo user authentication for instant access without signup

const DEMO_USER = {
  id: "demo_user_001",
  email: "demo@voiceca.app",
  name: "Demo User",
  isDemo: true,
  createdAt: new Date().toISOString(),
};

const DEMO_AUTH_TOKEN = "demo_token_voiceca_" + Math.random().toString(36).slice(2);

/**
 * Auto-login as demo user (for "Try Demo" button)
 */
export function loginAsDemo() {
  localStorage.setItem("voiceca_auth_token", DEMO_AUTH_TOKEN);
  localStorage.setItem("voiceca_user", JSON.stringify(DEMO_USER));
  localStorage.setItem("voiceca_is_demo", "true");
  return DEMO_USER;
}

/**
 * Check if current user is demo user
 */
export function isDemo() {
  return localStorage.getItem("voiceca_is_demo") === "true";
}

/**
 * Get demo user info
 */
export function getDemoUser() {
  return DEMO_USER;
}

/**
 * Logout from demo (clears demo data)
 */
export function logoutFromDemo() {
  localStorage.removeItem("voiceca_auth_token");
  localStorage.removeItem("voiceca_user");
  localStorage.removeItem("voiceca_is_demo");
  localStorage.removeItem("voiceca_onboarding");
  localStorage.removeItem("voiceca_hasOnboarded");
  localStorage.removeItem("voiceca_entries");
}

/**
 * Create sample onboarding for demo
 */
export function createSampleOnboarding() {
  return {
    businessType: "retail",
    painPoints: ["profit", "tax"],
    language: "Hindi",
    frequency: "daily",
    businessName: "Demo Shop",
  };
}

/**
 * Create sample entries for demo
 */
export function createSampleEntries() {
  return [
    {
      id: "sample_1",
      type: "expense",
      transcript: "Kal office ke liye 5000 rupee ka printer ink kharida",
      entities: {
        person: null,
        amount_base: 5000,
        gst_slab: "18%",
        gst_amount: 900,
        amount_total: 5900,
        date: new Date().toISOString().split("T")[0],
        category: "Office supplies",
        item: "printer ink",
        paid_to: null,
        deduction_eligible: true,
        deduction_section: "80C",
      },
      confirmation_hindi: "Office supplies ke liye 5000 rupee kharch ho gaya, 18% GST ke saath.",
      confirmation_english: "Office supplies recorded for ₹5000, with 18% GST.",
      tax_summary: {
        taxable_amount: 5000,
        estimated_tax: "₹1500 tax savings possible",
        action: "Claim as 80C deduction",
      },
      action_required: "Keep invoice for GST return",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sample_2",
      type: "expense",
      transcript: "Travel expense for client meeting - taxi 800 rupee",
      entities: {
        amount_base: 800,
        gst_slab: "5%",
        gst_amount: 40,
        amount_total: 840,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        category: "Travel",
        item: "taxi",
        deduction_eligible: true,
        deduction_section: "80TTA",
      },
      confirmation_hindi: "Travel expense ₹800 record ho gaya.",
      confirmation_english: "Travel expense recorded for ₹800.",
      tax_summary: {
        taxable_amount: 800,
        estimated_tax: "₹240 tax savings possible",
        action: "Deductible business expense",
      },
      action_required: "Keep receipt",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sample_3",
      type: "credit_entry",
      transcript: "Sharma ko 15000 rupee ka goods credit diya",
      entities: {
        person: "Sharma",
        amount_base: 15000,
        gst_slab: "exempt",
        gst_amount: 0,
        amount_total: 15000,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        category: "sales",
        item: "goods",
        deduction_eligible: false,
        deduction_section: "none",
      },
      confirmation_hindi: "Sharma ko 15000 rupee credit diya gaya.",
      confirmation_english: "Credit entry logged for Sharma: ₹15000.",
      tax_summary: null,
      action_required: "Follow up for payment",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sample_4",
      type: "expense",
      transcript: "Staff ka salary 30000 rupee diya",
      entities: {
        amount_base: 30000,
        gst_slab: "0%",
        gst_amount: 0,
        amount_total: 30000,
        date: new Date().toISOString().split("T")[0],
        category: "Salaries",
        deduction_eligible: true,
        deduction_section: "direct",
      },
      confirmation_hindi: "Staff salary ₹30000 record ho gaya.",
      confirmation_english: "Staff salary recorded for ₹30000.",
      tax_summary: {
        taxable_amount: 30000,
        estimated_tax: "₹9000 tax savings possible",
        action: "Fully deductible expense",
      },
      action_required: "Maintain salary records",
      createdAt: new Date().toISOString(),
    },
  ];
}
