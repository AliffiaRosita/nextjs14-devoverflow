"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
  Call
} from "@stream-io/video-react-sdk";

import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";
import VideoCallRoom from "./VideoCallRoom";
import VideoCallSetup from "./VideoCallSetup";

import "@/styles/stream-video.css";
import { useShallow } from "zustand/react/shallow";
import { useBoundStore } from "@/store/useBoundStore";
import VideoCallError from "./VideoCallError";
import { sendNotification } from "@/lib/actions/knock.action";
import { usePathname, useSearchParams } from "next/navigation";

const VideoCallStarter = () => {
  const [
    callRoomId,
    knockUser,
    questionId,
    invitedUsers,
    mongoUser
  ] = useBoundStore(
    useShallow((state) => [
      state.callRoomId, 
      state.knockUser,
      state.questionId,
      state.invitedUsers, 
      state.mongoUser
    ]),
  );

  const searchParams = useSearchParams()

  const inviteId = searchParams.get('invite')

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();
  const pathname = usePathname();

  useEffect(() => {
      const startRoom = async () => {
          if (!client || !callRoomId || !mongoUser?._id) return;
          try {

          const newCall = client.call('default', callRoomId);
          const call = await newCall.getOrCreate({
              data: {
                  starts_at: new Date().toISOString(),
                  custom: {
                      questionId,
                  },
              },
          });

          if (call) {
            setCall(newCall)
            setIsCallLoading(false);
          }

        } catch (error) {
          console.error(error);
          setIsCallLoading(false);
        }
      };
      startRoom();
  }, [client, callRoomId, questionId]);

  const handleSetupComplete = useCallback(() => {
    setIsSetupComplete(true);
  }, []);

  const setupComponent = useMemo(() => {
    if (knockUser && !inviteId) {
      const invitedUserNames = invitedUsers.map(inviteUser => {
            sendNotification({
                title: 'New Video Call Invitation',
                type: 'video_call',
                message: `You have a New Video Call Invitation from ${knockUser.name || 'A User'}`,
                sender: knockUser.name,
                userId: inviteUser.clerkId,
                path: `${pathname}?invite=${knockUser.id}`,
            });
            return inviteUser.name;

        });

        toast({
          title: `📨 Invitation Sent!`,
          description: `Invited: ${invitedUserNames.join(', ')}`,
          variant: "default",
        });
    }

    return (
      <VideoCallSetup
        setIsSetupComplete={handleSetupComplete}
      />
    );
  }, [handleSetupComplete]);

  const roomComponent = useMemo(() => {
    return <VideoCallRoom />;
  }, []);

  if (isCallLoading) return <Loader />;

  if (!call) return <VideoCallError message="Call Failed! Please try again!" />;

  return (
      <StreamCall call={call}>
          <StreamTheme className="light">
              {!isSetupComplete ? setupComponent : roomComponent}
          </StreamTheme>
      </StreamCall>
  );
};

export default VideoCallStarter;
