"use client";

import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { Loader } from "lucide-react";

import { useGetLiveCalls } from "@/hooks/useGetLiveCalls";

import MeetingCard from "../cards/MeetingCard";
import { Button } from "../ui/button";
import Modal from "../shared/Modal";

const LiveVideoCall = ({
  id,
  handleClick = () => {},
}: {
  id: string | null;
  handleClick: () => void;
}) => {
  const { liveCalls, isLoading: isLiveLoading } = useGetLiveCalls(id);

  if (isLiveLoading) return <Loader />;

  const calls = liveCalls;

  const noCallsMessage = "No Live Calls";

  return (
    <>
      {calls && calls.length > 0 ? (
        calls.map((call: Call | CallRecording) => (
          <MeetingCard
            key={(call as Call).id}
            title={
              (call as Call).state?.custom?.description ||
              "Live Video Call Available"
            }
            date={
              (call as Call).state?.startsAt?.toLocaleString() ||
              (call as CallRecording).start_time?.toLocaleString()
            }
          />
        ))
      ) : (
        <h2 className="text-dark300_light700 text-center">{noCallsMessage}</h2>
      )}
      <Button
        type="submit"
        className="primary-gradient w-full text-white"
        disabled={false}
        onClick={handleClick}
      >
        {calls && calls.length > 0 ? "Join Video Call" : "Start Video Call"}
      </Button>
    </>
  );
};

const VideoCallModal = ({
  handleOnConfirm = () => {},
  handleOnClose = () => {},
  isOpen,
  selectedQuestionId,
}: {
  handleOnConfirm: () => void;
  handleOnClose: () => void;
  isOpen: boolean;
  selectedQuestionId: string | null;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      title="Start a Video Call"
      className="text-center"
    >
      <LiveVideoCall id={selectedQuestionId} handleClick={handleOnConfirm} />
    </Modal>
  );
};

export default VideoCallModal;
