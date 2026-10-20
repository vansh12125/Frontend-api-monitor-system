import { apiClient } from "@/config";

export const LoginUser = async (data) => {
  return await apiClient.post("/auth/signin", data);
};

export const RegisterUser = async (data) => {
  return await apiClient.post("/auth/signup", data);
};

export const LogoutUser = async () => {
  return await apiClient.get("/auth/signout");
};

export const LogoutUserAll = async () => {
  return await apiClient.get("/auth/signout/all");
};

export const GetProfile = async () => {
  return await apiClient.get("/auth/me");
};

export const UpdatePassword = async (data) => {
  return await apiClient.patch("/auth/password", data);
};

export const RotateToken = async () => {
  return await apiClient.post("/auth/refresh");
};
