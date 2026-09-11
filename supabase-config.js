// Add the Supabase Publishable key from Project Settings > API.
const SUPABASE_CONFIG = {
  url: "https://zvmllgugbbvpjaksgfqi.supabase.co",
  anonKey: "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"
};

const supabaseBackend = {
  enabled() {
    return Boolean(
      SUPABASE_CONFIG.url &&
      SUPABASE_CONFIG.anonKey &&
      !SUPABASE_CONFIG.anonKey.includes("PASTE_YOUR")
    );
  },
  async request(table, method = "GET", body = null, query = "") {
    if (!this.enabled()) return null;
    const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}${query}`, {
      method,
      headers: {
        apikey: SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) throw new Error(await response.text());
    return response.status === 204 ? null : response.json();
  },
  async saveReport(report) {
    return this.request("reports", "POST", {
      report_id: report.id,
      lot_id: report.lot,
      category: report.category,
      condition: report.condition || "Not working",
      quantity: report.quantity || 1,
      weight: report.weight,
      location: report.location,
      description: report.description || "",
      image: report.image || "",
      status: report.status,
      credits: report.credits
    });
  }
};
