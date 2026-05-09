import { useState } from "react";
import { useLanguage } from "@/context";
import {
  NavbarMobile,
  Contacts,
  Chat,
  Friends,
  Settings,
} from "@/components/layout";
import { Drawer, Button, ExpandDiv } from "@/components/ui";

export const MobileView = () => {
  const { t } = useLanguage();
  const [screen, setScreen] = useState<
    "contacts" | "chat" | "friends" | "settings"
  >("contacts");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const goBack = () => {
    setScreen("contacts");
  };

  const renderScreen = () => {
    switch (screen) {
      case "chat":
        return <Chat />;
      case "friends":
        return <Friends />;
      case "settings":
        return <Settings />;
      default:
        return <Contacts openChat={() => setScreen("chat")} />;
    }
  };

  return (
    <div className="mobile">
      <NavbarMobile
        toggleDrawer={() => setDrawerOpen(true)}
        canGoBack={screen !== "contacts"}
        goBack={goBack}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        title={t("nav.menu")}
      >
        <ExpandDiv scroll className="drawer-slidediv" bar="faded">
          <div className="drawer-content">
            <Button
              box
              text={t("nav.friends")}
              onClick={() => {
                setScreen("friends");
                setDrawerOpen(false);
              }}
            />
            <Button
              box
              text={t("nav.settings")}
              onClick={() => {
                setScreen("settings");
                setDrawerOpen(false);
              }}
            />
          </div>
        </ExpandDiv>
      </Drawer>

      <div className="content">{renderScreen()}</div>
    </div>
  );
};
