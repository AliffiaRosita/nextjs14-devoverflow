"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useGetLiveCalls } from "@/hooks/useGetLiveCalls";

import Loader from "@/components/shared/Loader";
import VideoCallStarter from "./VideoCallStarter";
import VideoCallList from "./VideoCallList";

interface VideoCallProps {
  inviteId?: string;
  userAuthorId: string;
  questionId: string | null;
  userId: string;
}

const VideoCall = ({
  inviteId,
  userAuthorId,
  questionId,
  userId,
}: VideoCallProps) => {
  const isUserAuthor = userId === userAuthorId;

  const { liveCalls, isLoading: isLiveLoading } = useGetLiveCalls(questionId);
  const [isShowCallRoom, setIsShowCallRoom] = useState<boolean>(
    !isUserAuthor || !!inviteId
  );
  const [callRoomId, setCallRoomId] = useState<string>(
    `${questionId}-${inviteId || (isUserAuthor ? userAuthorId : userId)}`
  );

  const handleShowCallRoom = useCallback(() => setIsShowCallRoom(true), []);
  const handleSetCallRoomId = useCallback(
    (roomId: string) => setCallRoomId(roomId),
    []
  );

  const videoCallContent = useMemo(() => {
    return isShowCallRoom ? (
      <VideoCallStarter questionId={questionId} roomId={callRoomId} />
    ) : (
      <VideoCallList
        liveCalls={liveCalls}
        setIsShowCallRoom={handleShowCallRoom}
        setCallRoomId={handleSetCallRoomId}
      />
    );
  }, [
    isShowCallRoom,
    questionId,
    callRoomId,
    liveCalls,
    handleShowCallRoom,
    handleSetCallRoomId,
  ]);

  if (isLiveLoading) return <Loader />;

  return videoCallContent;
};

export default VideoCall;
