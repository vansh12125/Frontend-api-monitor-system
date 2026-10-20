import { apiClient } from "@/config";

export const CreateApiKey = async (data) => {
  return await apiClient.post("/client/api-keys", data);
};

export const GetAllApiKey = async () => {
  return await apiClient.get("/client/api-keys");
};

export const DeactivateApiKey = async (data) => {
  return await apiClient.patch("/client/api-keys/deactivate", data);
};

export const ActivateApiKey = async (data) => {
  return await apiClient.patch("/client/api-keys/activate", data);
};

export const DeleteApiKey = async (data) => {
  return await apiClient.delete("/client/api-keys", data);
};
