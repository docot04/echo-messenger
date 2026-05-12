import { type NavbarMobileProps } from "@/services";
import { Typography, ExpandDiv } from "@/components/ui";
import { useLanguage } from "@/context";

export const NavbarMobile = ({
  toggleDrawer,
  canGoBack,
  goBack,
}: NavbarMobileProps) => {
  const { t } = useLanguage();

  return (
    <ExpandDiv bar="faded" className="navbar-mobile">
      {canGoBack ? (
        <button onClick={goBack}>{"⮜"}</button>
      ) : (
        <button onClick={toggleDrawer}>☰</button>
      )}

      <Typography text={t("echo")} glitch mono bordered />
    </ExpandDiv>
  );
};
