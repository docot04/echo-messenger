import { type ReactNode, useState, useEffect } from "react";
import {
  type ProfileModalProps,
  type FriendAction,
  profileActionService,
  editProfileService,
  type FriendPayload,
} from "@/services";
import { Popup } from "../Popup/Popup";
import { Button } from "../Button/Button";
import { useLanguage, useAlert } from "@/context";
import { PopupSkeleton } from "../PopupSkeleton/PopupSkeleton";
import { FormModal } from "../FormModal/FormModal";
import { InputBox } from "../InputBox/InputBox";
import { Spinner } from "../Spinner/Spinner";

export const ProfileModal = ({
  loading = false,
  open,
  onClose,
  name,
  icon,
  _id,
  bio,
  datejoined,
  self = false,
  blocked = false,
  blockedBy = false,
  friend = false,
  sentReq = false,
  recReq = false,
}: ProfileModalProps) => {
  const { t } = useLanguage();
  const { pushAlert } = useAlert();
  const [formOpen, setFormOpen] = useState(false);
  const [formAction, setFormAction] = useState<string>("");
  const [editName, setEditName] = useState(name ?? "");
  const [editBio, setEditBio] = useState(bio ?? "");
  const [editPic, setEditPic] = useState(icon ?? "");
  const [imageLoading, setImageLoading] = useState(true);

  // edit profile form
  useEffect(() => {
    setEditName(name ?? "");
    setEditBio(bio ?? "");
    setEditPic(icon ?? "");
    setImageLoading(true);
  }, [name, bio, icon]);

  // form helper
  const handleActionClick = (action: string) => {
    setFormAction(action);
    setFormOpen(true);
  };

  // confirm handler
  const handleConfirm = async () => {
    // edit profile
    if (self) {
      const payload = {
        name: editName,
        bio: editBio,
        pic: editPic,
      };
      const success = await editProfileService({
        payload,
        t,
        pushAlert,
      });
      if (success) {
        setFormOpen(false);
        onClose();
      }
      return;
    }
    if (!_id) return;

    const actionMap: Record<string, FriendAction> = {
      [t("profile.add_friend")]: "add",
      [t("profile.accept_request")]: "accept",
      [t("profile.reject_request")]: "reject",
      [t("profile.remove_friend")]: "remove",
      [t("profile.block_user")]: "block",
      [t("profile.unblock_user")]: "unblock",
    };

    const action = actionMap[formAction];
    if (!action) return;
    const user: FriendPayload = {
      user: _id,
    };
    const success = await profileActionService({
      action,
      user,
      t,
      pushAlert,
    });
    if (success) {
      setFormOpen(false);
      onClose();
    }
  };

  let topButton: ReactNode = null;
  let bottom1 = {
    text: "",
    disabled: false,
  };
  let bottom2 = {
    text: "",
    disabled: false,
  };

  if (self) {
    topButton = (
      <Button
        box
        text={t("profile.edit_profile")}
        width="calc(100% - 1rem)"
        onClick={() => handleActionClick(t("profile.edit_profile"))}
      />
    );
  } else if (friend) {
    topButton = (
      // assign action for this buton later
      <Button box text={t("profile.send_message")} width="calc(100% - 1rem)" />
    );

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

  if (loading)
    return <PopupSkeleton width="22rem" open={open} onClose={onClose} />;

  return (
    <>
      <Popup
        open={open}
        onClose={() => {
          setFormOpen(false);
          onClose();
        }}
        title={t("profile.profile_details")}
      >
        <div className="profilemodal">
          <div className="profile-top">
            <img src={icon} alt={name} />
            <p>{name}</p>
          </div>

          <p className="bio">{bio}</p>

          <p className="date">
            {t("profile.acc_created")}{" "}
            {datejoined ? new Date(datejoined).toLocaleDateString("en-IN") : ""}
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
                  onClick={() => handleActionClick(bottom1.text)}
                />
                <Button
                  box
                  text={bottom2.text}
                  disabled={bottom2.disabled}
                  width="100%"
                  onClick={() => handleActionClick(bottom2.text)}
                />
              </div>
            )}
          </div>
        </div>
      </Popup>
      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={formAction}
        onConfirm={handleConfirm}
      >
        {formAction === t("profile.edit_profile") ? (
          <div className="edit-profile-form">
            <div className="profile-preview">
              {imageLoading && <Spinner size="1.5rem" />}
              {editPic && !imageLoading && (
                <img
                  src={editPic}
                  alt="preview"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                  style={{
                    display: imageLoading ? "none" : "block",
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            <InputBox
              label={t("auth.username")}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <InputBox
              label={t("profile.bio")}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
            />

            <InputBox
              label={t("profile.pic")}
              value={editPic}
              onChange={(e) => {
                setImageLoading(true);
                setEditPic(e.target.value);
              }}
            />
          </div>
        ) : (
          <p>
            {t("common.confirm")} {formAction.toLowerCase()}?
          </p>
        )}
      </FormModal>
    </>
  );
};
