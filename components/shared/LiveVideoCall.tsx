"use client";

import { Call, CallRecording } from "@stream-io/video-react-sdk";

import { useGetLiveCalls } from "@/hooks/useGetLiveCalls";
import MeetingCard from "./MeetingCard";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

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

export default LiveVideoCall;
