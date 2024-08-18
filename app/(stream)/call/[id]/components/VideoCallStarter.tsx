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
import { useShallow } from "zustand/react/shallow";
import { useBoundStore } from "@/store/useBoundStore";
import { createVideoCall, getVideoCallByRoomId, updateVideoCall } from "@/lib/actions/videoCall.action";

const VideoCallStarter = () => {
  const [
    callRoomId,
    questionId,
    invitedMentors,
    mongoUser
  ] = useBoundStore(
    useShallow((state) => [
      state.callRoomId, 
      state.questionId,
      state.invitedMentors,
      state.mongoUser
    ]),
  );

  const { call, isCallLoading } = useGetCallById(callRoomId!);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

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
          if (!client || !callRoomId || !mongoUser?._id) return;

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
              //! Todo: register new call to db
              const videoCall = await getVideoCallByRoomId({ callRoomId });
              if (!videoCall) {
                  const invitedIds = invitedMentors.map(member => member._id);
                  await createVideoCall({
                      callRoomId,
                      invitedIds,
                      memberIds: [],
                      createdBy: mongoUser._id,
                      questionId,
                      type: 'author',
                  });
              } else {
                  if (
                      videoCall.invitedIds.includes(mongoUser._id) &&
                      !videoCall.memberIds.length
                  ) {
                      await updateVideoCall({
                          callRoomId,
                          updateData: {
                              memberIds: [mongoUser._id],
                          },
                      });
                      setIsAllowed(true);
                  } else if (
                      videoCall.invitedIds.includes(mongoUser._id) &&
                      videoCall.memberIds.includes(mongoUser._id)
                  ) {
                      setIsAllowed(true);
                  } else if (videoCall.createdBy === mongoUser._id) {
                      setIsAllowed(true);
                  } else {
                      setIsAllowed(false);
                  }
              }
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
