import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data: {
  email: string;
  full_name: string;
  password: string;
  is_patient: boolean;
}) => api.post("/auth/register", data);

export const login = (email: string, password: string) => {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  return api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const getMe = () => api.get("/auth/me");
export const assessRiskPublic = (data: object) => api.post("/risk/assess-public", data);
export const assessRisk = (data: object) => api.post("/risk/assess", data);
export const getProfile = () => api.get("/patient/profile");
export const createProfile = (data: object) => api.post("/patient/profile", data);
export const logGlucose = (data: object) => api.post("/patient/glucose", data);
export const getGlucoseLogs = (limit = 30) => api.get(`/patient/glucose?limit=${limit}`);
export const getEpisodes = (limit = 20) => api.get(`/patient/episodes?limit=${limit}`);
export const addMedication = (data: object) => api.post("/patient/medications", data);
export const getMedications = () => api.get("/patient/medications");
export const logAdherence = (data: object) => api.post("/patient/adherence", data);
export const getAdherenceSummary = () => api.get("/patient/adherence/summary");
export const getReport = (days = 30) =>
  api.get(`/patient/report?days=${days}`, { responseType: "blob" });

export default api;
