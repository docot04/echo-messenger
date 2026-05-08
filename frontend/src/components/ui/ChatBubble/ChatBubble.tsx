import React, { useState } from "react";
import { Dropdown } from "../Dropdown/Dropdown";

type Props = {
  sent?: boolean;
  content?: string;
  time?: string;
  sender?: string;
  icon?: string;
  typing?: boolean;
};

export const ChatBubble: React.FC<Props> = ({
  sent = false,
  content = "",
  time = "",
  sender = "",
  icon,
  typing = false,
}) => {
  const [open, setOpen] = useState(false);

  const items = sent
    ? [
        {
          title: "Copy",
          callback: () => console.log("Copy"),
        },
        {
          title: "Delete",
          callback: () => console.log("Delete"),
        },
        {
          title: "Forward",
          callback: () => console.log("Forward"),
        },
      ]
    : [
        {
          title: "Copy",
          callback: () => console.log("Copy"),
        },
        {
          title: "Forward",
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
