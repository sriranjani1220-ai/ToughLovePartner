import axios from "axios";
import { supabase } from "../supabaseClient";

const api = axios.create({ baseURL: "/api" });

// Attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Goals
export const getGoals = () => api.get("/goals/").then((r) => r.data);
export const createGoal = (payload) => api.post("/goals/", payload).then((r) => r.data);
export const updateGoal = (id, payload) => api.put(`/goals/${id}`, payload).then((r) => r.data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`).then((r) => r.data);

// Tasks
export const createTask = (payload) => api.post("/tasks/", payload).then((r) => r.data);
export const updateTask = (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);

// Notifications
export const getVapidKey = () => api.get("/notifications/vapid-public-key").then((r) => r.data.key);
export const saveSubscription = (subscription) =>
  api.post("/notifications/subscribe", { subscription }).then((r) => r.data);
