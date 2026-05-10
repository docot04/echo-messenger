import { useLanguage } from "@/context";
export const RotateScreen = () => {
  const { t } = useLanguage();
  return (
    <div className="rotate-screen">
      <div>
        <h1>{t("misc.rotate_screen_title")}</h1>
        <p>{t("misc.rotate_screen_subtitle")}</p>
      </div>
    </div>
  );
};
