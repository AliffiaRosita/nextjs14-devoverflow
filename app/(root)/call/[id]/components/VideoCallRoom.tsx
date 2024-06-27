"use client";

import React, { useEffect, useState } from "react";
import {
  CallingState,
  StreamCall,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { useGetCallById } from "@/hooks/useGetCallById";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import MeetingSetup from "./MeetingSetup";
import MeetingRoom from "./MeetingRoom";

import "@/styles/stream.css";
import Loader from "@/components/shared/Loader";

interface VideoCallRoomProps {
  roomId: string;
}

const VideoCallRoom = ({ roomId }: VideoCallRoomProps) => {
  const { call, isCallLoading } = useGetCallById(roomId!);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    return () => {
      if (!call || isCallLoading) {
        return;
      }

      if (call.state.callingState === CallingState.JOINED) {
        call.leave();
      }

      call.camera.disable();
      call.microphone.disable();
    };
  }, [call, isCallLoading]);

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
