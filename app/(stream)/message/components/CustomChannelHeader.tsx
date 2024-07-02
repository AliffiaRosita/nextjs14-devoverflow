import { FC } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ChannelHeader, ChannelHeaderProps } from "stream-chat-react";

type BackButtonProps = {
  onClick?: () => void;
};

const BackButton: FC<BackButtonProps> = ({ onClick = () => {} }) => {
  return (
    <div
      className="flex-center me-6 flex cursor-pointer flex-wrap gap-1"
      onClick={onClick}
    >
      <span title="go back">
        <ArrowLeft color="red" />
      </span>
      <span className="small-regular text-dark200_light900 line-clamp-1">
        Go Back
      </span>
    </div>
  );
};

const CustomChannelHeader: FC<ChannelHeaderProps> = (props) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#17191c]">
      <ChannelHeader {...props} />
      <BackButton onClick={() => router.back()} />
    </div>
  );
};

export default CustomChannelHeader;
