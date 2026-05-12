import { type NavbarWebProps } from "@/services";
import { Button, Typography, ExpandDiv } from "@/components/ui";
import { useLanguage } from "@/context";

export const NavbarWeb = ({ view, setView }: NavbarWebProps) => {
  const { t } = useLanguage();
  return (
    <div className="navbar-web-container">
      <ExpandDiv bar="faded" body="solid">
        <Typography text={t("echo")} bordered glitch mono />
        <Button
          height="2rem"
          box
          text={t("nav.home")}
          onClick={() => setView("home")}
          active={view == "home" ? "bottom" : undefined}
        />
        <Button
          height="2rem"
          box
          text={t("nav.friends")}
          onClick={() => setView("friends")}
          active={view == "friends" ? "bottom" : undefined}
        />
        <Button
          height="2rem"
          box
          text={t("nav.settings")}
          onClick={() => setView("settings")}
          active={view == "settings" ? "bottom" : undefined}
        />
      </ExpandDiv>
    </div>
  );
};
