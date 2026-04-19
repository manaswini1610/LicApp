// const BaseUrl = "http://localhost:5000/api";
const BaseUrl = "https://lic-app-backend.vercel.app/api";

// https://lic-app-three.vercel.app/

const API_URLS = {
  Policies: `${BaseUrl}`,
  Dashboard: `${BaseUrl}/dashboard`,
  Auth: `${BaseUrl}/auth`,
};

/** localStorage key for the dashboard yearly policy target (persisted client-side). */
export const DASHBOARD_YEARLY_TARGET_STORAGE_KEY =
  "lic_dashboard_yearly_target";

export default API_URLS;
