import { useState } from "react";
import {
  NavbarWeb,
  Contacts,
  Chat,
  Home,
  Friends,
  Settings,
} from "@/components/layout";

export const WebView = () => {
  const [view, setView] = useState("home");
  const [activeChat, setActiveChat] = useState(false);

  const openChat = () => {
    setActiveChat(true);
    setView("");
  };

  const handleNavChange = (nextView: string) => {
    setActiveChat(false);
    setView(nextView);
  };

  const renderRight = () => {
    if (activeChat) {
      return <Chat />;
    }

    switch (view) {
      case "friends":
        return <Friends />;
      case "settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };
  return (
    <div className="web">
      <NavbarWeb view={view} setView={handleNavChange} />
      <div className="flex body">
        <Contacts openChat={openChat} className="web-contacts" />
        {renderRight()}
      </div>
    </div>
  );
};
