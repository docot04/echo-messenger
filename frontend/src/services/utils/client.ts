const BASE_URL = import.meta.env.VITE_API_URL;
import { authStore } from "./store";

type RequestOptions = RequestInit & {
  token?: string;
};

export const apiClient = async (
  endpoint: string,
  options: RequestOptions = {},
) => {
  const token = authStore.token.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};
