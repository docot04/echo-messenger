import { Tree, Typography } from "@/components/ui";
import { useLanguage } from "@/context";
import info from "@/info.json";

export const Settings = () => {
  const { t } = useLanguage();

  // move this outside
  const treeData = [
    {
      text: t("settings.general"),
      children: [
        {
          title: t("settings.general-change_theme"),
          subtitle: t("settings.general-change-theme-info"),
          onClick: () => console.log("1.1"),
        },
        {
          title: t("settings.general-notifications"),
          subtitle: t("settings.general-notifications-info"),
          onClick: () => console.log("1.2"),
        },
        {
          title: t("settings.general-language"),
          subtitle: t("settings.general-language-info"),
          onClick: () => console.log("1.3"),
        },
        {
          title: t("settings.general-time_format"),
          subtitle: t("settings.general-time_format-info"),
          onClick: () => console.log("1.4"),
        },
      ],
    },
    {
      text: t("settings.profile"),
      children: [
        {
          title: t("settings.profile-view_profile"),
          subtitle: t("settings.profile-view_profile-info"),
          onClick: () => console.log("2.1"),
        },
        {
          title: t("settings.profile-blocked_users"),
          subtitle: t("settings.profile-blocked_users-info"),
          onClick: () => console.log("2.2"),
        },
        {
          title: t("settings.profile-logout"),
          subtitle: t("settings.profile-logout-info"),
          onClick: () => console.log("2.3"),
        },
        {
          title: t("settings.profile-delete_account"),
          subtitle: t("settings.profile-delete_account-info"),
          onClick: () => console.log("2.4"),
        },
      ],
    },
    {
      text: t("settings.about_echo"),
      children: [
        {
          title: t("settings.about_echo-data_usage"),
          subtitle: t("settings.about_echo-data_usage-info"),
          onClick: () => console.log("3.1"),
        },
        {
          title: t("settings.about_echo-patch_notes"),
          subtitle: t("settings.about_echo-patch_notes-info"),
          onClick: () => console.log("3.2"),
        },
        {
          title: t("settings.about_echo-github"),
          subtitle: t("settings.about_echo-github-info"),
          onClick: () => window.open(info.GITHUB_URL, "_blank"),
        },
        {
          title: t("settings.about_echo-app_version"),
          subtitle: info.APP_VERSION,
          onClick: () =>
            console.log(
              `App version ${info.APP_VERSION} running in ${info.REACT_ENVIRONMENT} mode`,
            ),
        },
      ],
    },
  ];

  return (
    <div className="settings">
      <Typography
        shadow
        className="settings-heading"
        text={t("nav.settings")}
        reveal
      />
      <div className="tree">
        <Tree data={treeData} />
      </div>
    </div>
  );
};
