"use client";

import { useShallow } from 'zustand/react/shallow'

import VideoCallStarter from "./VideoCallStarter";
import { VideoCallProps } from "@/types";
import { useBoundStore } from "@/store/useBoundStore";

const VideoCall = ({
  userAuthorId,
  questionId,
  knockUser,
  mongoUser,
  invitedMentors,
  callRoomId,
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

  setInvitedMentors(invitedMentors)
  setKnockUser(knockUser)
  setUserAuthorId(userAuthorId)
  setCallRoomId(callRoomId)
  setQuestionId(questionId)
  setMongoUser(mongoUser)

  return <VideoCallStarter />;
};

export default VideoCall;
