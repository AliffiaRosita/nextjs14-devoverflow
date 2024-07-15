"use client";
import useIdleTimer from "@/hooks/useIdleTimer";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { Dot } from "lucide-react";

const UserAvailability = () => {
  const { isOnline } = useNetworkStatus();
  const isIdle = useIdleTimer(5000, () => {});
  const isOnCall = false;

  let iconColor = "text-green-600";

  if (isIdle || !isOnline) {
    console.log("on idle");
    iconColor = "text-yellow-600";
  }

  if (isOnCall && isOnline) {
    console.log("on call");
    iconColor = "text-red-600";
  }

  return (
    <>
      <Dot size={50} className={iconColor} /> {iconColor}
    </>
  );
};
export default UserAvailability;
