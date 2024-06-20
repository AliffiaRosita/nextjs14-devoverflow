"use client";

import {
  StreamCall,
  StreamTheme,
  // useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useState } from "react";
import { Loader } from "lucide-react";
import MeetingSetup from "./MeetingSetup";
import MeetingRoom from "./MeetingRoom";
import { useUser } from "@clerk/nextjs";
// import Alert from "./Alert";

// interface ModalProps {
//   // isOpen: boolean;
//   // onClose: () => void;
//   // title: string;
//   // className?: string;
//   // children?: ReactNode;
//   // handleClick?: () => void;
//   // buttonText?: string;
//   // instantMeeting?: boolean;
//   // image?: string;
//   // buttonClassName?: string;
//   // buttonIcon?: string;
// }

const VideoCallRoom = ({ roomId, authorId }) => {
  const { call, isCallLoading } = useGetCallById(roomId!);
  const { isLoaded, user } = useUser();
  const userId = user?.id;
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

    const isRoomAuthor = userId === authorId;

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  // const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  // if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  return (
    <>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom isRoomAuthor={isRoomAuthor} />
          )}
        </StreamTheme>
      </StreamCall>
    </>
  );
};

export default VideoCallRoom;
