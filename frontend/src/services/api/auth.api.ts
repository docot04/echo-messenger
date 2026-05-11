import { apiClient } from "../utils";

// register user
type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  publicKey: string;
  encryptedPrivateKey: string;
  encryptedPrivateKeySalt: string;
  encryptedPrivateKeyIV: string;
};
export const registerUser = async (payload: RegisterUserPayload) => {
  return apiClient("/user/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// auth user
type AuthUserPayload = {
  email: string;
  password: string;
};
export const authUser = async (payload: AuthUserPayload) => {
  return apiClient("/user/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
