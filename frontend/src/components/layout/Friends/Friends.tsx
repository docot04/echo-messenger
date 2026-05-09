import {
  Button,
  InputBox,
  DropdownExtended,
  ButtonExtended,
  Typography,
  ExpandDiv,
} from "@/components/ui";
import { useLanguage } from "@/context";

export const Friends = () => {
  const { t } = useLanguage();

  return (
    <div className="friends">
      <div className="friends-top">
        <Typography
          shadow
          reveal
          text={t("friends.search_users")}
          className="friends-heading"
        />
      </div>
      <div className="friends-search">
        <InputBox
          type="text"
          placeholder={t("friends.enter_username")}
          className="friends-search-box"
        />
        <Button box text={t("common.search")} height="3.35rem" />
      </div>
      <div className="friendlist">
        <Typography
          shadow
          reveal
          text={t("friends.friendlist")}
          className="friends-heading"
        />
        <ExpandDiv bar="faded" scroll className="friendlist" body="none">
          <div className="friendlist-content">
            {/* ONLY FOR TESTING */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
              <ButtonExtended
                key={c}
                icon={`https://i.pravatar.cc/100/${c}`}
                contextHighlight
                title={`Contact ${c}`}
                context2={`ONLINE`}
                width="calc(100% - 2rem)"
                height="2.5rem"
                // active="right"
              />
            ))}
          </div>
        </ExpandDiv>
      </div>
    </div>
  );
};
