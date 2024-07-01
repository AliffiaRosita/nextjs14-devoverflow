import { Call } from "@stream-io/video-react-sdk";
import { useMemo, useCallback } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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

  const videoCallList = useMemo(() => {
    if (!liveCalls || liveCalls.length === 0) {
      return (
        <h2 className="text-dark300_light700 text-center">
          No Video Call Invitation
        </h2>
      );
    }
    return (
      <>
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="flex-center flex w-full cursor-pointer items-center rounded-md bg-red-500 px-4 py-2.5 text-sm text-white">
              Join Video Call
              <ChevronDown size={15} className="ml-2" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-500">
            {liveCalls.map((call: Call, index: number) => {
              const createdBy = call?.state?.createdBy?.name || "";
              const startAt = call.state?.startsAt?.toLocaleString() || "";

              const option = `${createdBy} - ${startAt}`;
              return (
                <div key={index}>
                  <DropdownMenuItem
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      setCallRoomId(call.id);
                      setIsShowCallRoom(true);
                    }}
                  >
                    {option}
                  </DropdownMenuItem>
                  {index !== liveCalls.length - 1 && (
                    <DropdownMenuSeparator className="border-dark-500" />
                  )}
                </div>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        or
      </>
    );
  }, [liveCalls, setCallRoomId, setIsShowCallRoom]);

  return (
    <div className="flex-center flex size-full items-center">
      <div className="flex-center flex flex-col gap-2">
        {videoCallList}
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
