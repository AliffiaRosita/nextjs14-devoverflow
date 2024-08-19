import { useCallback } from "react";

import { Button } from "@/components/ui/button";

interface VideoCallListProps {
  setIsShowCallRoom: (value: boolean) => void;
}

const VideoCallList = ({
  setIsShowCallRoom,
}: VideoCallListProps) => {
  const handleStartNewCall = useCallback(() => {
    setIsShowCallRoom(true);
  }, [setIsShowCallRoom]);

  return (
    <div className="flex-center flex size-full items-center">
      <div className="flex-center flex flex-col gap-2">
        <Button
          className="primary-gradient rounded-md px-4 py-2.5 text-white"
          onClick={handleStartNewCall}
        >
          Start A New Call
        </Button>
      </div>
    </div>
  );
};

export default VideoCallList;
