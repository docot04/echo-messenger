type UserId = string;

type UserBase = {
  _id: UserId;
  name: string;
  email: string;
  bio?: string;
  pic?: string;
};

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

export type EditProfilePayload = Partial<
  Pick<UserBase, "name" | "bio" | "pic">
>;

export type FriendPayload = {
  user: UserId;
};

export type FetchFriendsResponse = Pick<UserBase, "name" | "bio" | "pic">;
