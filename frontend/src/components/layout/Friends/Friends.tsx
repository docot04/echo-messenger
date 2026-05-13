import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  InputBox,
  Dropdown,
  DropdownExtended,
  ButtonExtendedSkeleton,
  ButtonExtended,
  Typography,
  ProfileModal,
  ExpandDiv,
} from "@/components/ui";
import { useLanguage, useAlert } from "@/context";
import {
  searchUserService,
  getUserService,
  fetchFriendsService,
  type FriendSearchUser,
  type FriendDropdownItem,
  type ProfileModalData,
  type FriendUser,
} from "@/services";

export const Friends = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState<FriendDropdownItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [friendsData, setFriendsData] = useState<{
    friends: FriendUser[];
    sentRequests: FriendUser[];
    recievedRequests: FriendUser[];
  }>({
    friends: [],
    sentRequests: [],
    recievedRequests: [],
  });
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [activeFriendId, setActiveFriendId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileModalData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [friendDropdownOpen, setFriendDropdownOpen] = useState(false);
  const { t } = useLanguage();
  const { pushAlert } = useAlert();
  const friendTabs = [
    t("friends.your_friends"),
    t("friends.sent_requests"),
    t("friends.pending_requests"),
  ];
  const [activeFriendTab, setActiveFriendTab] = useState(friendTabs[0]);

  // call fetch friends on component mount
  useEffect(() => {
    const loadFriends = async () => {
      try {
        setFriendsLoading(true);
        const data = await fetchFriendsService();
        setFriendsData(data);
      } catch (error: any) {
        pushAlert(
          error instanceof Error ? error.message : String(error),
          "error",
        );
      } finally {
        setFriendsLoading(false);
      }
    };
    loadFriends();
  }, [pushAlert]);

  // filtering logic
  const filteredUsers = useMemo(() => {
    switch (activeFriendTab) {
      case t("friends.sent_requests"):
        return friendsData.sentRequests;
      case t("friends.pending_requests"):
        return friendsData.recievedRequests;
      default:
        return friendsData.friends;
    }
  }, [activeFriendTab, friendsData, t]);
  const hasPendingRequests = friendsData.recievedRequests.length > 0;

  // search user
  const handleSearch = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      setDropdownOpen(true);
      setSearched(false);
      const results = await searchUserService(query, handleUserClick, t);
      setUsers(results);
      setSearched(true);
    } catch (error: any) {
      pushAlert(
        error instanceof Error ? error.message : String(error),
        "error",
      );
      setUsers([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // open profile on clicking a user
  const handleUserClick = async (user: FriendSearchUser) => {
    const currentId = user._id;
    try {
      setActiveFriendId(currentId);
      setProfileOpen(true);
      setProfileData(null);
      setProfileLoading(true);
      const fullUser = await getUserService(currentId);
      if (currentId !== user._id) return;
      setProfileData(fullUser);
    } catch (error: any) {
      pushAlert(
        error instanceof Error ? error.message : String(error),
        "error",
      );
      setProfileOpen(false);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="friends">
      <div className="friends-top">
        <Typography
          shadow
          reveal
          text={t("friends.search_users")}
          className="friends-heading"
        />
      </div>
      <div className="friends-search-wrapper">
        <form className="friends-search" onSubmit={handleSearch}>
          <InputBox
            type="text"
            placeholder={t("friends.enter_username")}
            className="friends-search-box"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            box
            text={t("common.search")}
            height="3.35rem"
            type="submit"
          />
        </form>
        <DropdownExtended
          open={dropdownOpen}
          loading={loading}
          loadingCount={4}
          emptyText={searched ? t("friends.no_users_found") : undefined}
          onClose={() => setDropdownOpen(false)}
          items={users}
          className="friends-dropdown"
        />
      </div>
      <div className="friendlist">
        <div className="friendlist-top">
          <Typography
            shadow
            reveal
            text={t("friends.friendlist")}
            className="friends-heading"
          />
          <div className="friendlist-dropdown-wrapper">
            <Button
              arrow="none"
              text={activeFriendTab}
              height="2.5rem"
              width="9rem"
              notify={hasPendingRequests}
              onClick={() => setFriendDropdownOpen((prev) => !prev)}
            />
            <Dropdown
              arrow="left"
              width="10rem"
              open={friendDropdownOpen}
              onClose={() => setFriendDropdownOpen(false)}
              items={[
                {
                  title: t("friends.your_friends"),
                  callback: () => setActiveFriendTab(t("friends.your_friends")),
                },
                {
                  title: t("friends.sent_requests"),
                  callback: () =>
                    setActiveFriendTab(t("friends.sent_requests")),
                },
                {
                  title: t("friends.pending_requests"),
                  notify: hasPendingRequests,
                  callback: () =>
                    setActiveFriendTab(t("friends.pending_requests")),
                },
              ]}
            />
          </div>
        </div>
        <ExpandDiv bar="faded" scroll className="friendlist" body="none">
          <div className="friendlist-content">
            {friendsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ButtonExtendedSkeleton
                  key={i}
                  width="calc(100% - 2rem)"
                  height="2.5rem"
                  icon
                />
              ))
            ) : filteredUsers.length === 0 ? (
              <p className="friendlist-empty">{t("friends.no_users_found")}</p>
            ) : (
              filteredUsers.map((user) => (
                <ButtonExtended
                  key={user._id}
                  icon={user.pic}
                  title={user.name}
                  width="calc(100% - 2rem)"
                  height="2.5rem"
                  active={activeFriendId === user._id ? "right" : undefined}
                  onClick={() =>
                    handleUserClick({
                      _id: user._id,
                      name: user.name,
                      email: "",
                      bio: user.bio,
                      pic: user.pic,
                    })
                  }
                />
              ))
            )}
          </div>
        </ExpandDiv>
      </div>
      <ProfileModal
        open={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          setProfileData(null);
          setActiveFriendId(null);
        }}
        loading={profileLoading}
        {...profileData}
      />
    </div>
  );
};
