import { FC } from "react";
import { ChannelHeader, ChannelHeaderProps } from "stream-chat-react";
import BackButton from "@/components/shared/BackButton";

const CustomChannelHeader: FC<ChannelHeaderProps> = (props) => {
  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#17191c]">
      <ChannelHeader {...props} />
      <BackButton />
    </div>
  );
};

export default CustomChannelHeader;
