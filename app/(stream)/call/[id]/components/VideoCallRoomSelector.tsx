"use client";

import React, { useState } from "react";
import { Call } from "@stream-io/video-react-sdk";

import { useGetLiveCalls } from "@/hooks/useGetLiveCalls";
import Loader from "@/components/shared/Loader";

import MeetingCard from "./MeetingCard";
import VideoCallRoom from "./VideoCallRoom";
import { Button } from "@/components/ui/button";

const VideoCallRoomSelector = ({
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
    <VideoCallRoom roomId={callRoomId} isUserAuthor={isUserAuthor} />
  ) : (
    <div className="flex-center flex flex-col gap-2">
      {liveCalls && liveCalls.length > 0 ? (
        liveCalls.map((call: Call) => (
          <MeetingCard
            key={call.id}
            title={call.state?.custom?.description || "Video Call Invitation"}
            createdBy={call.state?.createdBy}
            date={call.state?.startsAt?.toLocaleString() || "-"}
            onClick={() => {
              setCallRoomId(call.id);
              setIsShowCallRoom(true);
            }}
          />
        ))
      ) : (
        <h2 className="text-dark300_light700 text-center">
          No Video Call Invitation
        </h2>
      )}

      <Button
        className="primary-gradient mt-2.5 rounded-md px-4 py-2.5 text-white"
        onClick={() => {
          setIsShowCallRoom(true);
        }}
      >
        Start A New Call
      </Button>
    </div>
  );
};

export default VideoCallRoomSelector;
