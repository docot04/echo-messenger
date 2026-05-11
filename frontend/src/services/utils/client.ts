const BASE_URL = import.meta.env.VITE_API_URL;

type RequestOptions = RequestInit & {
  token?: string;
};

export const apiClient = async (
  endpoint: string,
  options: RequestOptions = {},
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};
