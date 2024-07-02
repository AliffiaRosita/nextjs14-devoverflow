import { UserResource } from "@clerk/types";
import { useCallback, useMemo, FC } from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";

interface ChatSidebarProps {
  user: UserResource;
  show: boolean;
  onClose: () => void;
  customActiveChannel?: string;
  resetActiveChannel: () => void;
}

const MessageSidebar: FC<ChatSidebarProps> = ({
  user,
  show,
  onClose,
  customActiveChannel,
  resetActiveChannel,
}) => {
  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          resetActiveChannel();
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose, resetActiveChannel]
  );

  const filters = useMemo(
    () => ({
      type: "messaging",
      members: { $in: [user.id] },
    }),
    [user.id]
  );

  const additionalChannelSearchProps = useMemo(
    () => ({
      searchForChannels: true,
      searchQueryParams: {
        channelFilters: {
          filters: { members: { $in: [user.id] } },
        },
      },
    }),
    [user.id]
  );

  return (
    <div
      className={`relative w-full flex-col md:max-w-[360px] ${
        show ? "flex" : "hidden"
      }`}
    >
      <ChannelList
        filters={filters}
        sort={{ last_message_at: -1 }}
        options={{ state: true, presence: true, limit: 10 }}
        customActiveChannel={customActiveChannel}
        showChannelSearch
        additionalChannelSearchProps={additionalChannelSearchProps}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
};

export default MessageSidebar;
