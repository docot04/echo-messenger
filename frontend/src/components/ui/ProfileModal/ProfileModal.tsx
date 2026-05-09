import React from "react";
import { Popup } from "../Popup/Popup";
import { Button } from "../Button/Button";
import { useLanguage } from "@/context";

type Props = {
  open: boolean;
  onClose: () => void;
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

export const ProfileModal: React.FC<Props> = ({
  open,
  onClose,
  name,
  icon,
  bio,
  datejoined,
  self = false,
  blocked = false,
  blockedBy = false,
  friend = false,
  sentReq = false,
  recReq = false,
}) => {
  const { t } = useLanguage();
  let topButton: React.ReactNode = null;
  let bottom1 = {
    text: "",
    disabled: false,
  };
  let bottom2 = {
    text: "",
    disabled: false,
  };

  if (self) {
    topButton = <Button box text={t("profile.edit_profile")} width="29rem" />;
  } else if (friend) {
    topButton = <Button box text={t("profile.send_message")} width="29rem" />;

    bottom1 = {
      text: t("profile.remove_friend"),
      disabled: false,
    };

    bottom2 = {
      text: t("profile.block_user"),
      disabled: false,
    };
  } else if (blocked) {
    bottom1 = {
      text: t("profile.add_friend"),
      disabled: true,
    };

    bottom2 = {
      text: t("profile.unblock_user"),
      disabled: false,
    };
  } else if (blockedBy) {
    bottom1 = {
      text: t("profile.add_friend"),
      disabled: true,
    };

    bottom2 = {
      text: t("profile.block_user"),
      disabled: true,
    };
  } else if (sentReq) {
    bottom1 = {
      text: t("profile.add_friend"),
      disabled: true,
    };

    bottom2 = {
      text: t("profile.block_user"),
      disabled: false,
    };
  } else if (recReq) {
    bottom1 = {
      text: t("profile.accept_request"),
      disabled: false,
    };

    bottom2 = {
      text: t("profile.reject_request"),
      disabled: false,
    };
  } else {
    bottom1 = {
      text: t("profile.add_friend"),
      disabled: false,
    };

    bottom2 = {
      text: t("profile.block_user"),
      disabled: false,
    };
  }

  return (
    <Popup open={open} onClose={onClose} title={t("profile.profile_details")}>
      <div className="profilemodal">
        <div className="profile-top">
          <img src={icon} alt={name} />
          <p>{name}</p>
        </div>

        <p className="bio">{bio}</p>

        <p className="date">
          {t("profile.acc_created")} {datejoined}
        </p>

        <div className="buttons">
          {topButton}

          {!self && (
            <div className="bottom-buttons">
              <Button
                box
                text={bottom1.text}
                disabled={bottom1.disabled}
                width="100%"
              />
              <Button
                box
                text={bottom2.text}
                disabled={bottom2.disabled}
                width="100%"
              />
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
};
