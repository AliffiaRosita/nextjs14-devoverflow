import {
  Channel,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import CustomChannelHeader from "./CustomChannelHeader";

interface ChatChannelProps {
  show: boolean;
  hideChannelOnThread: boolean;
  activeChannel: any;
}

export default function ChatChannel({
  show,
  hideChannelOnThread,
  activeChannel,
}: ChatChannelProps) {
  return (
    <div className={`size-full ${show ? "block" : "hidden"}`}>
      <Channel channel={activeChannel}>
        <Window hideOnThread={hideChannelOnThread}>
          <CustomChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </div>
  );
}
