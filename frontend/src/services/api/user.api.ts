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

// search user
type SearchUserResponse = {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  pic?: string;
}[];
export const searchUser = async (
  search: string,
): Promise<SearchUserResponse> => {
  const params = new URLSearchParams({
    search,
  });
  return apiClient(`/user?${params.toString()}`, {
    method: "GET",
  });
};

// get user
type FriendStatus = {
  self: boolean;
  blockedBy: boolean;
  blocked: boolean;
  friend: boolean;
  sentReq: boolean;
  recReq: boolean;
};
type GetUserResponse = {
  _id: string;
  name: string;
  email: string;
  bio: string;
  pic: string;
  friends: string[];
  dateJoined: string;
} & FriendStatus;
export const getUser = async (id: string): Promise<GetUserResponse> => {
  return apiClient(`/user/${id}`, { method: "GET" });
};
