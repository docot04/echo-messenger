import { searchUser, getUser } from "../api";

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
    name: user.name,
    icon: user.pic,
    bio: user.bio,
    datejoined: user.dateJoined,
    self: user.self,
    blocked: user.blocked,
    blockedBy: user.blockedBy,
    friend: user.friend,
    sentReq: user.sentReq,
    recReq: user.recReq,
  };
};
