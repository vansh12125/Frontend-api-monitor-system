import { apiClient } from "@/config";

export const GetStats = async () => {
  return await apiClient.get("/analytics/stats");
};

export const GetDashboard = async () => {
  return await apiClient.get("/analytics/dashboard");
};

export const ExportCsv = async () => {
  return await apiClient.get("/analytics/export");
};

export const GetEndpointHealth = async () => {
  return await apiClient.get("/analytics/endpoint-health");
};

export const GetRequestHistory = async () => {
  return await apiClient.get("/analytics/request-history");
};
