import { apiClient } from "../utils";
import type {
  RegisterUserPayload,
  AuthUserPayload,
  GetUserResponse,
  GetSelfResponse,
  FriendPayload,
  FetchFriendsResponse,
  EditProfilePayload,
  SearchUserResponse,
  FetchBlockedResponse,
} from "../types";

// register user
export const registerUser = async (payload: RegisterUserPayload) => {
  return apiClient("/user/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// auth user
export const authUser = async (payload: AuthUserPayload) => {
  return apiClient("/user/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// search user
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
export const getUser = async (id: string): Promise<GetUserResponse> => {
  return apiClient(`/user/${id}`, { method: "GET" });
};

// get self
export const getSelf = async (): Promise<GetSelfResponse> => {
  return apiClient("/user/me", { method: "GET" });
};

// edit profile
export const editProfile = async (
  payload: EditProfilePayload,
): Promise<EditProfilePayload> => {
  return apiClient("/user/edit", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

// send friend req
export const sendFriendReq = async (payload: FriendPayload) => {
  return apiClient("/user/friend", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// accept friend req
export const acceptFriendReq = async (payload: FriendPayload) => {
  return apiClient("/user/friend/accept", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// reject friend req
export const rejectFriendReq = async (payload: FriendPayload) => {
  return apiClient("/user/friend/reject", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// remove friend
export const removeFriend = async (payload: FriendPayload) => {
  return apiClient("/user/friend/remove", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// block user
export const blockUser = async (payload: FriendPayload) => {
  return apiClient("/user/friend/block", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// unblock user
export const unblockUser = async (payload: FriendPayload) => {
  return apiClient("/user/friend/unblock", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// fetchFriends
export const fetchFriends = async (): Promise<FetchFriendsResponse> => {
  return apiClient("/user/friend/all", { method: "GET" });
};

// fetchBlocked
export const fetchBlocked = async (): Promise<FetchBlockedResponse> => {
  return apiClient("/user/friend/allblocked", { method: "GET" });
};
