import {
  searchUser,
  getUser,
  fetchFriends,
  sendFriendReq,
  acceptFriendReq,
  rejectFriendReq,
  removeFriend,
  blockUser,
  unblockUser,
  editProfile,
} from "../api";
import type {
  FetchFriendsResponse,
  ProfileActionServiceParams,
  EditProfileServiceParams,
} from "../types";

// search user
export type FriendSearchUser = {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  pic?: string;
};
export type FriendDropdownItem = {
  id: string;
  title: string;
  icon?: string;
  context?: string;
  callback: () => void;
};
export const searchUserService = async (
  query: string,
  onUserClick: (user: FriendSearchUser) => void,
): Promise<FriendDropdownItem[]> => {
  if (!query.trim()) return [];
  const users: FriendSearchUser[] = await searchUser(query);
  return users.map((user) => ({
    id: user._id,
    title: user.name,
    icon: user.pic,
    context: user.email, // TODO LATER: THIS SHOULD BE FRIENDS/NON FRIENDS STATUS
    callback: () => onUserClick(user),
  }));
};

// get user
export type ProfileModalData = {
  _id: string;
  name: string;
  icon: string;
  bio: string;
  datejoined: string;
  self?: boolean;
  blocked?: boolean;
  blockedBy?: boolean;
  friend?: boolean;
  sentReq?: boolean;
  recReq?: boolean;
};
export const getUserService = async (id: string): Promise<ProfileModalData> => {
  const user = await getUser(id);
  return {
    _id: user._id,
    name: user.name,
    icon: user.pic ?? "",
    bio: user.bio ?? "",
    datejoined: user.dateJoined,
    self: user.self,
    blocked: user.blocked,
    blockedBy: user.blockedBy,
    friend: user.friend,
    sentReq: user.sentReq,
    recReq: user.recReq,
  };
};

// fetch friends
export const fetchFriendsService = async (): Promise<FetchFriendsResponse> => {
  return await fetchFriends();
};

// profilemodal services
export const profileActionService = async ({
  action,
  user,
  t,
  pushAlert,
}: ProfileActionServiceParams) => {
  try {
    switch (action) {
      case "add":
        await sendFriendReq(user);
        pushAlert(t("friends.friend_request_sent"), "success");
        break;

      case "accept":
        await acceptFriendReq(user);
        pushAlert(t("friends.friend_request_accepted"), "success");
        break;

      case "reject":
        await rejectFriendReq(user);
        pushAlert(t("friends.friend_request_rejected"), "success");
        break;

      case "remove":
        await removeFriend(user);
        pushAlert(t("friends.friend_removed"), "success");
        break;

      case "block":
        await blockUser(user);
        pushAlert(t("friends.user_blocked"), "success");
        break;

      case "unblock":
        await unblockUser(user);
        pushAlert(t("friends.user_unblocked"), "success");
        break;
    }
    return true;
  } catch (error: any) {
    pushAlert(error instanceof Error ? error.message : String(error), "error");
    return false;
  }
};

export const editProfileService = async ({
  payload,
  t,
  pushAlert,
}: EditProfileServiceParams) => {
  try {
    await editProfile(payload);
    pushAlert(t("profile.profile_update_successful"), "success");
    return true;
  } catch (error: any) {
    pushAlert(error instanceof Error ? error.message : String(error), "error");
    return false;
  }
};
