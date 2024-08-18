"use client";

import { useShallow } from 'zustand/react/shallow'

import VideoCallStarter from "./VideoCallStarter";
import { VideoCallProps } from "@/types";
import { useBoundStore } from "@/store/useBoundStore";

const VideoCall = ({
  inviteId,
  userAuthorId,
  questionId,
  userId,
  knockUser,
  mongoUser,
  invitedMentors
}: VideoCallProps) => {
  const [
    setInvitedMentors,
    setKnockUser,
    setUserAuthorId,
    setCallRoomId,
    setQuestionId,
    setMongoUser,
  ] = useBoundStore(
    useShallow((state) => [
      state.setInvitedMentors, 
      state.setKnockUser,
      state.setUserAuthorId, 
      state.setCallRoomId, 
      state.setQuestionId,
      state.setMongoUser
    ]),
  );

  const isUserAuthor = userId === userAuthorId;

  const callRoomId = `${questionId}-${inviteId || (isUserAuthor ? userAuthorId : userId)}`;

  setInvitedMentors(invitedMentors)
  setKnockUser(knockUser)
  setUserAuthorId(userAuthorId)
  setCallRoomId(callRoomId)
  setQuestionId(questionId)
  setMongoUser(mongoUser)

  return <VideoCallStarter />;
};

export default VideoCall;
