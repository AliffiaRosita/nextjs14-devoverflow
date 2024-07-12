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

import CustomChannelHeader from "./CustomChannelHeader";
import { sendNotification } from "@/lib/actions/knock.action";
import { ChannelInnerProps, ChatChannelProps } from "@/types";

const ChannelInner: FC<ChannelInnerProps> = ({
  hideChannelOnThread,
  knockUser,
}) => {
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
      await sendNotification({
        title: "New Message",
        type: "message",
        message: `You have a New Message from ${knockUser.name || "A User"}`,
        sender: knockUser.name,
        userId: receiverUserId,
        path: `/message`,
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
