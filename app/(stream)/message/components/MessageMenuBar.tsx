import { FC } from "react";
import PushSubscriptionToggleButton from "./PushSubscriptionToggleButton";

const MessageMenuBar: FC = () => {
  return (
    <div className="flex items-center justify-between gap-3 border-e border-e-[#DBDDE1] bg-white p-3 dark:border-e-gray-800 dark:bg-[#17191c]">
      <div className="flex gap-6">
        <PushSubscriptionToggleButton />
      </div>
    </div>
  );
};

export default MessageMenuBar;
