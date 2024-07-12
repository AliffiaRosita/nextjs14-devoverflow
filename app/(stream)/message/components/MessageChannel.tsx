import { FC } from "react";
import {
  Channel,
  MessageInput,
  MessageList,
  MessageToSend,
  Thread,
  useChannelActionContext,
  useChannelStateContext,
  Window,
} from "stream-chat-react";
import type { Channel as StreamChannel } from "stream-chat";

import CustomChannelHeader from "./CustomChannelHeader";
import { notify } from "@/lib/actions/knock.action";

interface ChatChannelProps {
  show: boolean;
  hideChannelOnThread: boolean;
  activeChannel: StreamChannel | undefined;
}

const ChannelInner: FC = ({ hideChannelOnThread, knockUser }) => {
  const { sendMessage } = useChannelActionContext();

  const { members } = useChannelStateContext();

  const overrideSubmitHandler = async (message: MessageToSend) => {
    let receiverUserId = null;

    for (const key in members) {
      if (key !== knockUser.id) {
        receiverUserId = key;
        break;
      }
    }

    sendMessage(message);

    if (receiverUserId) {
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "";

      await notify({
        title: "New Message",
        type: "message",
        message: `You have a New Message from ${knockUser.name || "A User"}`,
        sender: knockUser.name,
        userId: receiverUserId,
        url: `${origin}/message`,
      });
    }
  };

  return (
    <>
      <Window hideOnThread={hideChannelOnThread}>
        <CustomChannelHeader />
        <MessageList />
        <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <Thread />
    </>
  );
};

const MessageChannel: FC<ChatChannelProps> = ({
  show,
  hideChannelOnThread,
  activeChannel,
  knockUser,
}) => {
  return (
    <div className={`size-full ${show ? "block" : "hidden"}`}>
      <Channel channel={activeChannel}>
        <ChannelInner
          hideChannelOnThread={hideChannelOnThread}
          knockUser={knockUser}
        />
        <Thread />
      </Channel>
    </div>
  );
};

export default MessageChannel;
