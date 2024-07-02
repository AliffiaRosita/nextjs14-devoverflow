import { FC } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  onClick?: () => void;
};

const BackButton: FC<BackButtonProps> = ({ onClick }) => {
  const router = useRouter();

  return (
    <div
      className="flex-center me-6 flex cursor-pointer flex-wrap gap-1"
      onClick={() => {
        if (!onClick) {
          router.back();
        } else {
          onClick();
        }
      }}
    >
      <span title="go back">
        <ArrowLeft color="red" />
      </span>
      <span className="small-regular text-dark200_light900 line-clamp-1 hover:text-primary-500">
        Go Back
      </span>
    </div>
  );
};

export default BackButton;
