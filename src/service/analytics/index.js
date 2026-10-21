import { apiClient } from "@/config";

export const GetOverallStats = async (startTime,endTime) => {
  return await apiClient.get("/analytics/stats",{params:{startTime,endTime}});
};

export const GetDashboard = async (startTime, endTime) => {
  return await apiClient.get("/analytics/dashboard", {
    params: {
      startTime,
      endTime,
    },
  });
};

export const ExportCsv = async (startTime, endTime) => {
  return await apiClient.get("/analytics/export", {
    responseType: "blob",
    params: {
      startTime,
      endTime,
    },
  });
};

export const GetEndpointHealth = async (params) => {
  return await apiClient.get("/analytics/endpoint-health",{params});
};

export const GetRequestHistory = async (params) => {
  return await apiClient.get("/analytics/request-history",{params});
};
