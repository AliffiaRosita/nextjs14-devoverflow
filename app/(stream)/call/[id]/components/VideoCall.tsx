"use client";

import React, { useState } from "react";

import { useGetLiveCalls } from "@/hooks/useGetLiveCalls";

import Loader from "@/components/shared/Loader";

import VideoCallStarter from "./VideoCallStarter";
import VideoCallList from "./VideoCallList";

const VideoCall = ({
  inviteId,
  userAuthorId,
  questionId,
  userId,
}: {
  inviteId?: string;
  userAuthorId: string;
  questionId: string | null;
  userId: string;
}) => {
  const isUserAuthor = userId === userAuthorId;

  const { liveCalls, isLoading: isLiveLoading } = useGetLiveCalls(questionId);
  const [isShowCallRoom, setIsShowCallRoom] = useState<boolean>(
    !isUserAuthor || !!inviteId
  );
  const [callRoomId, setCallRoomId] = useState<string>(
    `${questionId}-${inviteId || (isUserAuthor ? userAuthorId : userId)}`
  );

  if (isLiveLoading) return <Loader />;

  return isShowCallRoom ? (
    <VideoCallStarter roomId={callRoomId} />
  ) : (
    <VideoCallList
      liveCalls={liveCalls}
      setIsShowCallRoom={setIsShowCallRoom}
      setCallRoomId={setCallRoomId}
    />
  );
};

export default VideoCall;
