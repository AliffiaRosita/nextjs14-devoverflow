"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useGetLiveCalls } from "@/hooks/useGetLiveCalls";

import Loader from "@/components/shared/Loader";
import VideoCallStarter from "./VideoCallStarter";
import VideoCallList from "./VideoCallList";
import { VideoCallProps } from "@/types";
import { useSearchParams } from "next/navigation";

const VideoCall = ({
  inviteId,
  userAuthorId,
  questionId,
  userId,
  knockUser,
  relatedSkillUsers
}: VideoCallProps) => {
  const isUserAuthor = userId === userAuthorId;

  const { liveCalls, isLoading: isLiveLoading } = useGetLiveCalls(
    questionId,
    isUserAuthor
  );
  const searchParams = useSearchParams();
  const instantCall = searchParams.get('instant');

  const [isShowCallRoom, setIsShowCallRoom] = useState<boolean>(
    !isUserAuthor || !!inviteId || !!instantCall
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
      <VideoCallStarter
        questionId={questionId}
        roomId={callRoomId}
        userAuthorId={userAuthorId}
        knockUser={knockUser}
      />
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
    userAuthorId,
    knockUser,
    handleShowCallRoom,
    handleSetCallRoomId,
  ]);

  if (isLiveLoading) return <Loader />;

  return videoCallContent;
};

export default VideoCall;
