"use client";

import React, { useEffect, useState } from "react";
import {
  CallingState,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useGetCallById } from "@/hooks/useGetCallById";

import Loader from "@/components/shared/Loader";

import MeetingSetup from "./MeetingSetup";
import MeetingRoom from "./MeetingRoom";

import "@/styles/stream-video.css";

interface VideoCallRoomProps {
  roomId: string;
  isUserAuthor: boolean;
}

const VideoCallRoom = ({ roomId, isUserAuthor }: VideoCallRoomProps) => {
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
