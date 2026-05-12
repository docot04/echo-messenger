import { useState } from "react";
import { type ChatBubbleProps } from "@/services";
import { Dropdown } from "../Dropdown/Dropdown";
import { useLanguage } from "@/context";

export const ChatBubble = ({
  sent = false,
  content = "",
  time = "",
  sender = "",
  icon,
  typing = false,
}: ChatBubbleProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const items = sent
    ? [
        {
          title: t("common.copy"),
          callback: () => console.log("Copy"),
        },
        {
          title: t("common.delete"),
          callback: () => console.log("Delete"),
        },
        {
          title: t("common.forward"),
          callback: () => console.log("Forward"),
        },
      ]
    : [
        {
          title: t("common.copy"),
          callback: () => console.log("Copy"),
        },
        {
          title: t("common.forward"),
          callback: () => console.log("Forward"),
        },
      ];

  return (
    <div className={`chatbubble ${sent ? "sent" : "received"}`}>
      {!sent && icon && <img src={icon} alt="" className="icon" />}

      <div className="bubble-wrapper">
        <div className={`bubble ${open ? "open" : ""}`}>
          {!sent && sender && <p className="sender">{sender}</p>}

          <p className="content">
            {typing ? (
              <span className="dots">
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </span>
            ) : (
              content
            )}
          </p>

          <p className="time">{time}</p>
        </div>
        {!typing && (
          <div className="menu-wrapper">
            <button className="menu" onClick={() => setOpen((prev) => !prev)}>
              •••
            </button>

            <Dropdown
              arrow={sent ? "left" : "right"}
              open={open}
              items={items}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
