import { apiClient } from "@/config";

export const CreateViewer = async (data) => {
  return await apiClient.post("/client/users", data);
};

export const CreateAdmin = async (data) => {
  return await apiClient.post("/client", data);
};

export const GetAllViewer = async () => {
  return await apiClient.get("/client/users");
};

export const GetAllAdmin = async () => {
  return await apiClient.get("/client");
};
