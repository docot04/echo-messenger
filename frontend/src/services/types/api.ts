import { type TranslationKeys } from "@/locales";
type Alert = (message: string, type?: "success" | "error") => void;
export type Translate = (key: TranslationKeys) => string;

type ServiceBase = {
  t: Translate;
  pushAlert: Alert;
};

type AuthLogin = (params: {
  token: string;
  userId: string;
  privateKey: CryptoKey;
}) => Promise<void>;

export type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  login: AuthLogin;
} & ServiceBase;

export type AuthUserParams = {
  email: string;
  password: string;
  login: AuthLogin;
} & ServiceBase;

type UserId = string;

type UserBase = {
  _id: UserId;
  name: string;
  email: string;
  bio?: string;
  pic?: string;
};

export type FriendUser = Pick<UserBase, "_id" | "name" | "bio" | "pic">;

type CryptoKeys = {
  publicKey: string;
  encryptedPrivateKey: string;
  encryptedPrivateKeySalt: string;
  encryptedPrivateKeyIV: string;
};

type FriendStatus = {
  self: boolean;
  blockedBy: boolean;
  blocked: boolean;
  friend: boolean;
  sentReq: boolean;
  recReq: boolean;
};

export type AuthUserPayload = {
  email: string;
  password: string;
};

export type RegisterUserPayload = AuthUserPayload &
  CryptoKeys & {
    name: string;
  };

export type SearchUserResponse = UserBase[];

export type GetSelfResponse = UserBase &
  CryptoKeys & {
    friends: UserId[];
    blocked: UserId[];
    pendingRequests: UserId[];
    sentRequests: UserId[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };

export type GetUserResponse = UserBase &
  FriendStatus & {
    friends: UserId[];
    dateJoined: string;
  };

export type FriendSearchUser = {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  pic?: string;
  friend?: boolean;
};

export type FriendDropdownItem = {
  id: string;
  title: string;
  icon?: string;
  context?: string;
  callback: () => void;
};

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

export type EditProfilePayload = Partial<
  Pick<UserBase, "name" | "bio" | "pic">
>;

export type FriendPayload = {
  user: UserId;
};

export type FetchFriendsResponse = {
  friends: FriendUser[];
  sentRequests: FriendUser[];
  recievedRequests: FriendUser[];
};

export type FetchBlockedResponse = {
  blocked: FriendUser[];
};

export type FriendAction =
  | "add"
  | "accept"
  | "reject"
  | "remove"
  | "block"
  | "unblock";

export type ProfileActionServiceParams = {
  action: FriendAction;
  user: FriendPayload;
} & ServiceBase;

export type EditProfileServiceParams = {
  payload: EditProfilePayload;
} & ServiceBase;
