import { Call } from "@stream-io/video-react-sdk";
import { useMemo, useCallback } from "react";

import { Button } from "@/components/ui/button";

import VideoCallCard from "./VideoCallCard";

interface VideoCallListProps {
  liveCalls: Call[] | undefined;
  setIsShowCallRoom: (value: boolean) => void;
  setCallRoomId: (value: string) => void;
}

const VideoCallList = ({
  liveCalls,
  setIsShowCallRoom,
  setCallRoomId,
}: VideoCallListProps) => {
  const handleStartNewCall = useCallback(() => {
    setIsShowCallRoom(true);
  }, [setIsShowCallRoom]);

  const videoCallCards = useMemo(() => {
    if (!liveCalls || liveCalls.length === 0) {
      return (
        <h2 className="text-dark300_light700 text-center">
          No Video Call Invitation
        </h2>
      );
    }

    return liveCalls.map((call: Call) => (
      <VideoCallCard
        key={call.id}
        title={call.state?.custom?.description || "Video Call Invitation"}
        createdBy={call.state?.createdBy}
        date={call.state?.startsAt?.toLocaleString() || "-"}
        onClick={() => {
          setCallRoomId(call.id);
          setIsShowCallRoom(true);
        }}
      />
    ));
  }, [liveCalls, setCallRoomId, setIsShowCallRoom]);

  return (
    <div className="flex-center flex flex-col gap-2">
      {videoCallCards}
      <Button
        className="primary-gradient mt-2.5 rounded-md px-4 py-2.5 text-white"
        onClick={handleStartNewCall}
      >
        Start A New Call
      </Button>
    </div>
  );
};

export default VideoCallList;
