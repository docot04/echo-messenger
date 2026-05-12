import React, { useState } from "react";
import {
  Button,
  InputBox,
  DropdownExtended,
  ButtonExtended,
  Typography,
  ProfileModal,
  ExpandDiv,
} from "@/components/ui";
import { useLanguage, useAlert } from "@/context";
import {
  searchUserService,
  getUserService,
  type FriendSearchUser,
  type FriendDropdownItem,
  type ProfileModalData,
} from "@/services";

export const Friends = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState<FriendDropdownItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileModalData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { t } = useLanguage();
  const { pushAlert } = useAlert();

  const handleSearch = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      setDropdownOpen(true);
      setSearched(false);
      const results = await searchUserService(query, handleUserClick);
      setUsers(results);
      setSearched(true);
    } catch (err: any) {
      pushAlert(err, "error");
      setUsers([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (user: FriendSearchUser) => {
    try {
      setProfileOpen(true);
      setProfileData(null);
      setProfileLoading(true);
      const fullUser = await getUserService(user._id);
      setProfileData(fullUser);
    } catch (err: any) {
      pushAlert(err, "error");
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
      {/* friendlist */}
      <div className="friendlist">
        <Typography
          shadow
          reveal
          text={t("friends.friendlist")}
          className="friends-heading"
        />
        <ExpandDiv bar="faded" scroll className="friendlist" body="none">
          <div className="friendlist-content">
            {/* ONLY FOR TESTING */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
              <ButtonExtended
                key={c}
                icon={`https://i.pravatar.cc/100/${c}`}
                contextHighlight
                title={`Contact ${c}`}
                context2={`ONLINE`}
                width="calc(100% - 2rem)"
                height="2.5rem"
                // active="right"
              />
            ))}
          </div>
        </ExpandDiv>
      </div>
      <ProfileModal
        open={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          setProfileData(null);
        }}
        loading={profileLoading}
        {...profileData}
      />
    </div>
  );
};
