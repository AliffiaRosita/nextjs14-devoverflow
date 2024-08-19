"use client";

import { useShallow } from 'zustand/react/shallow'

import VideoCallStarter from "./VideoCallStarter";
import { VideoCallProps } from "@/types";
import { useBoundStore } from "@/store/useBoundStore";

const VideoCall = ({
  userAuthorClerkId,
  questionId,
  knockUser,
  mongoUser,
  invitedUsers,
  callRoomId,
}: VideoCallProps) => {
  const [
    setInvitedUsers,
    setKnockUser,
    setUserAuthorClerkId,
    setCallRoomId,
    setQuestionId,
    setMongoUser,
  ] = useBoundStore(
    useShallow((state) => [
      state.setInvitedUsers, 
      state.setKnockUser,
      state.setUserAuthorClerkId, 
      state.setCallRoomId, 
      state.setQuestionId,
      state.setMongoUser
    ]),
  );

  setInvitedUsers(invitedUsers)
  setKnockUser(knockUser)
  setUserAuthorClerkId(userAuthorClerkId)
  setCallRoomId(callRoomId)
  setQuestionId(questionId)
  setMongoUser(mongoUser)

  return <VideoCallStarter />;
};

export default VideoCall;
