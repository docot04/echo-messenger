import { Typography, SlidingDiv } from "@/components/ui";
import { useLanguage } from "@/context";
export const Home = () => {
  const { t } = useLanguage();
  return (
    <SlidingDiv direction="left" className="home-view">
      <h3>{t("home.welcome")}</h3>
      <Typography glitch mono reveal bordered text={t("echo")} />
      <p>{t("home.subtitle")}</p>
    </SlidingDiv>
  );
};
