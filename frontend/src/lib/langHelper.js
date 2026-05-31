export const getUiLang = () => localStorage.getItem("voiceca_ui_lang") || "en";

export const dashboardText = {
  en: {
    speak: "Speak",
    summary: "Summary",
    entries: "Entries",
    scan: "Scan Doc",
    kya_hua: "Kya hua aaj?",
    tap_speak: "Tap karo aur boliye",
    speaking: "Bolte rahiye...",
    processing: "Samajh rahe hain...",
    save: "Save",
    saved: "✓ Entry saved successfully!",
    income: "Income",
    expense: "Expense",
    profit: "Profit",
    gst: "GST Liability",
    deductible: "Deductible Amount",
  },
  hi: {
    speak: "बोलो",
    summary: "सारांश",
    entries: "प्रविष्टियाँ",
    scan: "डॉक्यूमेंट",
    kya_hua: "क्या हुआ आज?",
    tap_speak: "टैप करो और बोलो",
    speaking: "बोलते रहो...",
    processing: "समझ रहे हैं...",
    save: "सहेजो",
    saved: "✓ प्रविष्टि सहेज दी गई!",
    income: "आय",
    expense: "खर्च",
    profit: "मुनाफ़ा",
    gst: "GST देयता",
    deductible: "कटौती की रक़म",
  },
  gu: {
    speak: "બોલો",
    summary: "સારાંશ",
    entries: "એન્ટ્રીઝ",
    scan: "ડોક્યુમેન્ટ",
    kya_hua: "આજ શું થયું?",
    tap_speak: "ટેપ કરો અને બોલો",
    speaking: "બોલતા રહો...",
    processing: "સમજીએ છીએ...",
    save: "સાચવો",
    saved: "✓ એન્ટ્રી સાચવી દીધી!",
  },
  mr: {
    speak: "बोला",
    summary: "सारांश",
    entries: "प्रविष्ट्या",
    scan: "दस्तऐवज",
    kya_hua: "आज काय झाले?",
    tap_speak: "टॅप करा आणि बोला",
    speaking: "बोलत रहा...",
    processing: "समजत आहे...",
    save: "जतन करा",
    saved: "✓ प्रविष्टी जतन केली!",
  },
};

export function gettext(key) {
  const lang = getUiLang();
  return dashboardText[lang]?.[key] || dashboardText.en[key] || key;
}
