import React, { useEffect, useState } from "react";
import { Popup } from "../Popup/Popup";
import { Button } from "../Button/Button";
import { ButtonExtended } from "../ButtonExtended/ButtonExtended";
import { ExpandDiv } from "../ExpandDiv/ExpandDiv";
import { useLanguage } from "@/context";

type User = {
  id: string;
  name: string;
  icon: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  users: User[];
  submitText?: string;
  onSubmit?: (ids: string[]) => void;
};

export const UserListModal: React.FC<Props> = ({
  open,
  onClose,
  users,
  submitText = "Submit",
  onSubmit,
}) => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    if (!open) {
      setSelected([]);
    }
  }, [open]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <Popup open={open} onClose={onClose} title={t("menu.select_users")}>
      <div className="userlistmodal">
        <Button
          text={submitText}
          width="29rem"
          onClick={() => {
            onSubmit?.(selected);
            onClose();
          }}
        />

        <ExpandDiv scroll className="userlist" body="none" bar="solid">
          {users.map((user) => (
            <ButtonExtended
              arrow="none"
              bars={false}
              key={user.id}
              title={user.name}
              icon={user.icon}
              height="3rem"
              width="26.5rem"
              active={selected.includes(user.id) ? "right" : "none"}
              onClick={() => toggle(user.id)}
            />
          ))}
        </ExpandDiv>
      </div>
    </Popup>
  );
};
