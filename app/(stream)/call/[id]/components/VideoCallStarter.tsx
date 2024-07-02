"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  CallingState,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useGetCallById } from "@/hooks/useGetCallById";

import Loader from "@/components/shared/Loader";
import VideoCallRoom from "./VideoCallRoom";
import VideoCallSetup from "./VideoCallSetup";

import "@/styles/stream-video.css";

interface VideoCallRoomProps {
  roomId: string;
}

const VideoCallStarter = ({ roomId }: VideoCallRoomProps) => {
  const { call, isCallLoading } = useGetCallById(roomId!);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const client = useStreamVideoClient();

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

  useEffect(() => {
    const startRoom = async () => {
      if (!client || !roomId) return;

      const newCall = client.call("default", roomId);

      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            questionId: roomId,
          },
        },
      });
    };
    startRoom();
  }, [client, roomId]);

  const handleSetupComplete = useCallback(() => {
    setIsSetupComplete(true);
  }, []);

  const setupComponent = useMemo(() => {
    return <VideoCallSetup setIsSetupComplete={handleSetupComplete} />;
  }, [handleSetupComplete]);

  const roomComponent = useMemo(() => {
    return <VideoCallRoom />;
  }, []);

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
          {!isSetupComplete ? setupComponent : roomComponent}
        </StreamTheme>
      </StreamCall>
    </>
  );
};

export default VideoCallStarter;
