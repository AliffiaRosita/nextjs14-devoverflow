"use client";

import { Call, CallRecording } from "@stream-io/video-react-sdk";

import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { useGetLiveCalls } from "@/hooks/useGetLiveCalls";
import MeetingCard from "./MeetingCard";
import { Button } from "../ui/button";

const CallList = ({
  type,
  id,
  handleClick = () => {},
}: {
  type: "ended" | "upcoming" | "recordings" | "live";
  id: string | null;
}) => {
  const router = useRouter();
  const { liveCalls, isLoading: isLiveLoading } = useGetLiveCalls(id);

  if (isLiveLoading) return <Loader />;

  const calls = liveCalls;

  const noCallsMessage = "No Live Calls";

  return (
    <>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {calls && calls.length > 0 ? (
          calls.map((meeting: Call | CallRecording) => (
            <MeetingCard
              key={(meeting as Call).id}
              icon={
                type === "ended"
                  ? "/icons/previous.svg"
                  : type === "upcoming"
                    ? "/icons/upcoming.svg"
                    : "/icons/recordings.svg"
              }
              title={
                (meeting as Call).state?.custom?.description ||
                (meeting as CallRecording).filename?.substring(0, 20) ||
                "No Description"
              }
              date={
                (meeting as Call).state?.startsAt?.toLocaleString() ||
                (meeting as CallRecording).start_time?.toLocaleString()
              }
              isPreviousMeeting={type === "ended"}
              link={
                type === "recordings"
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
              }
              buttonIcon1={
                type === "recordings" ? "/icons/play.svg" : undefined
              }
              buttonText={type === "recordings" ? "Play" : "Start"}
              handleClick={
                type === "recordings"
                  ? () => router.push(`${(meeting as CallRecording).url}`)
                  : () => router.push(`/meeting/${(meeting as Call).id}`)
              }
            />
          ))
        ) : (
          <h1 className="text-2xl font-bold text-primary-500">
            {noCallsMessage}
          </h1>
        )}
      </div>

      <Button
        type="submit"
        className="primary-gradient w-fit text-white"
        disabled={false}
        onClick={handleClick}
      >
        {calls && calls.length > 0 ? 'Join Meeting' : "Start Meeting"}
      </Button>
    </>
  );
};

export default CallList;
