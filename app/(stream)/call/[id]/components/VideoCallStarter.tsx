"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
  Call
} from "@stream-io/video-react-sdk";

import Loader from "@/components/shared/Loader";
import VideoCallRoom from "./VideoCallRoom";
import VideoCallSetup from "./VideoCallSetup";

import "@/styles/stream-video.css";
import { useShallow } from "zustand/react/shallow";
import { useBoundStore } from "@/store/useBoundStore";

const VideoCallStarter = () => {
  const [
    callRoomId,
    questionId,
    mongoUser
  ] = useBoundStore(
    useShallow((state) => [
      state.callRoomId, 
      state.questionId,
      state.mongoUser
    ]),
  );

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
      const startRoom = async () => {
          if (!client || !callRoomId || !mongoUser?._id) return;
          try {

          const newCall = client.call('default', callRoomId);
          const call = await newCall.getOrCreate({
              data: {
                  starts_at: new Date().toISOString(),
                  custom: {
                      questionId,
                  },
              },
          });

          if (call) {
            setCall(newCall)
            setIsCallLoading(false);
          }

        } catch (error) {
          console.error(error);
          setIsCallLoading(false);
        }
      };
      startRoom();
  }, [client, callRoomId, questionId]);

  const handleSetupComplete = useCallback(() => {
    setIsSetupComplete(true);
  }, []);

  const setupComponent = useMemo(() => {
    return (
      <VideoCallSetup
        setIsSetupComplete={handleSetupComplete}
      />
    );
  }, [handleSetupComplete]);

  const roomComponent = useMemo(() => {
    return <VideoCallRoom />;
  }, []);

  if (isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold">
        Call Failed! Please try again!
      </p>
    );

  return (
      <StreamCall call={call}>
          <StreamTheme className="light">
              {!isSetupComplete ? setupComponent : roomComponent}
          </StreamTheme>
      </StreamCall>
  );
};

export default VideoCallStarter;
