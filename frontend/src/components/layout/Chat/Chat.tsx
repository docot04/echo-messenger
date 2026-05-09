import {
  ChatBubble,
  Button,
  InputBox,
  ExpandDiv,
  ButtonExtended,
} from "@/components/ui";
import { useLanguage } from "@/context";

const ICON = "https://i.pravatar.cc/100";

type Props = {
  chatName: string;
  icon: string;
  isGroup: boolean;
};

type MockChat = {
  sent?: boolean;
  content?: string;
  time?: string;
  typing?: boolean;
};

const generateChats = (n: number): MockChat[] => {
  const messages: MockChat[] = [];

  for (let i = 0; i < n - 1; i++) {
    messages.push({
      sent: i % 2 === 0,
      content: `test message ${i + 1}`,
      time: `12:${String(i).padStart(2, "0")}AM`,
    });
  }

  messages.push({
    typing: true,
  });

  return messages;
};

export const Chat = ({
  chatName = "chat.name",
  icon = ICON,
  isGroup = false,
}: Props) => {
  const { t } = useLanguage();

  const chats = generateChats(25);

  return (
    <div className="chat">
      <ButtonExtended
        icon={isGroup ? undefined : icon}
        title={chatName}
        height="2.5rem"
        className="chat-info"
        arrow="none"
        context2={"ONLINE"}
        contextHighlight
      />

      <ExpandDiv scroll bar="faded" body="none" className="chat-expand">
        <div className="chat-content">
          {chats.map((msg, i) => (
            <ChatBubble
              key={i}
              sent={msg.sent}
              content={msg.content}
              time={msg.time}
              typing={msg.typing}
              icon={!msg.sent ? icon : undefined}
            />
          ))}
        </div>
      </ExpandDiv>

      <div className="chat-input">
        <InputBox type="text" placeholder={t("chat.type_message")} />

        <Button box text={t("chat.send")} />
      </div>
    </div>
  );
};
