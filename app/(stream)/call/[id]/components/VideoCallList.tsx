import { Call } from "@stream-io/video-react-sdk";

import { Button } from "@/components/ui/button";

import VideoCallCard from "./VideoCallCard";

const VideoCallList = ({
  liveCalls,
  setIsShowCallRoom,
  setCallRoomId,
}: {
  liveCalls: Call[] | undefined;
  setIsShowCallRoom: (value: boolean) => void;
  setCallRoomId: (value: string) => void;
}) => {
  return (
    <div className="flex-center flex flex-col gap-2">
      {liveCalls && liveCalls.length > 0 ? (
        liveCalls.map((call: Call) => (
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
        ))
      ) : (
        <h2 className="text-dark300_light700 text-center">
          No Video Call Invitation
        </h2>
      )}

      <Button
        className="primary-gradient mt-2.5 rounded-md px-4 py-2.5 text-white"
        onClick={() => {
          setIsShowCallRoom(true);
        }}
      >
        Start A New Call
      </Button>
    </div>
  );
};

export default VideoCallList;
