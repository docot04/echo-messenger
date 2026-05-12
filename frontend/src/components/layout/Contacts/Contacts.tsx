import { useLanguage } from "@/context";
import { type ContactsProps } from "@/services";
import { Button, ButtonExtended, ExpandDiv, Typography } from "@/components/ui";

export const Contacts = ({ openChat, className = "" }: ContactsProps) => {
  const { t } = useLanguage();

  return (
    <div className={`contacts ${className}`}>
      <Typography
        shadow
        text={t("nav.chats")}
        reveal
        className="contacts-heading"
      />
      <ExpandDiv scroll bar="faded" body="none" className="contacts-div">
        <div className="contacts-div-content">
          <Button
            box
            text={t("contacts.new_group")}
            width="calc(100% - 3rem)"
          />
          {/* ONLY FOR TESTING */}
          {[1, 6].map((c) => (
            <ButtonExtended
              key={c}
              icon="https://i.pravatar.cc/100"
              title={`Contact ${c}`}
              subtitle={`${c}'s last text is displayed here`}
              onClick={openChat}
              context1={`${c}:${((c * 12) % 60) + 1} PM`}
              context2={`Muted`}
              width="calc(100% - 2rem)"
              height="4rem"
              // active="right"
            />
          ))}
        </div>
      </ExpandDiv>
    </div>
  );
};
