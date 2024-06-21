"use client";

import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useState } from "react";
import MeetingSetup from "./MeetingSetup";
import MeetingRoom from "./MeetingRoom";

import "@stream-io/video-react-sdk/dist/css/styles.css";

import "@/styles/stream.css";
import Loader from "./Loader";

interface VideoCallRoomProps {
  roomId: string;
}

const VideoCallRoom = ({ roomId }: VideoCallRoomProps) => {
  const { call, isCallLoading } = useGetCallById(roomId!);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  return (
    <>
      <StreamCall call={call}>
        <StreamTheme className="light">
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </>
  );
};

export default VideoCallRoom;
