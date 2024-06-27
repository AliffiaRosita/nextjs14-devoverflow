import { ChannelHeader, ChannelHeaderProps } from "stream-chat-react";

const CustomChannelHeader = (props: ChannelHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#17191c]">
      <ChannelHeader {...props} />
    </div>
  );
};

export default CustomChannelHeader;
