import React from "react";
import { Popup } from "../Popup/Popup";
import { Button } from "../Button/Button";

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
    topButton = <Button text="Edit Profile" width="29rem" />;
  } else if (friend) {
    topButton = <Button text="Send Message" width="29rem" />;

    bottom1 = {
      text: "Remove Friend",
      disabled: false,
    };

    bottom2 = {
      text: "Block User",
      disabled: false,
    };
  } else if (blocked) {
    bottom1 = {
      text: "Add Friend",
      disabled: true,
    };

    bottom2 = {
      text: "Unblock User",
      disabled: false,
    };
  } else if (blockedBy) {
    bottom1 = {
      text: "Add Friend",
      disabled: true,
    };

    bottom2 = {
      text: "Block User",
      disabled: true,
    };
  } else if (sentReq) {
    bottom1 = {
      text: "Add Friend",
      disabled: true,
    };

    bottom2 = {
      text: "Block User",
      disabled: false,
    };
  } else if (recReq) {
    bottom1 = {
      text: "Accept Request",
      disabled: false,
    };

    bottom2 = {
      text: "Reject Request",
      disabled: false,
    };
  } else {
    bottom1 = {
      text: "Add Friend",
      disabled: false,
    };

    bottom2 = {
      text: "Block User",
      disabled: false,
    };
  }

  return (
    <Popup open={open} onClose={onClose} title="Account Details">
      <div className="profilemodal">
        <div className="profile-top">
          <img src={icon} alt="" />
          <p>{name}</p>
        </div>

        <p className="bio">{bio}</p>

        <p className="date">Account created on {datejoined}</p>

        <div className="buttons">
          {topButton}

          {!self && (
            <div className="bottom-buttons">
              <Button
                text={bottom1.text}
                disabled={bottom1.disabled}
                width="100%"
              />

              <Button
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
