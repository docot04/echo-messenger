import { Typography, ExpandDiv } from "@/components/ui";
import { useLanguage } from "@/context";

type Props = {
  toggleDrawer: () => void;
  canGoBack: boolean;
  goBack: () => void;
};

export const NavbarMobile = ({ toggleDrawer, canGoBack, goBack }: Props) => {
  const { t } = useLanguage();

  return (
    <ExpandDiv bar="faded" className="navbar-mobile">
      {canGoBack ? (
        <button onClick={goBack}>{"<"}</button>
      ) : (
        <button onClick={toggleDrawer}>☰</button>
      )}

      <Typography text={t("echo")} glitch mono bordered />
    </ExpandDiv>
  );
};
