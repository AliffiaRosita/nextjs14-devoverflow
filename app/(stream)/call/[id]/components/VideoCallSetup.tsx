"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { sendNotification } from "@/lib/actions/knock.action";
import { VideoCallSetupProps } from "@/types";

const VideoCallSetup = ({
  setIsSetupComplete,
  userAuthorId,
  knockUser,
}: VideoCallSetupProps) => {
  const call = useCall();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user } = useUser();

  const instantCall = searchParams.get('instant')

  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );
  }
  if (!user) throw new Error("User not found");

  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  const invitationLink = useMemo(
    () => `${window.location.href}?invite=${user.id}`,
    [user.id]
  );

  const handleJoin = useCallback(async () => {
    //! Todo: instant call notification logic 
    await sendNotification({
      title: "New Video Call Invitation",
      type: "video_call",
      message: `You have a New Video Call Invitation from ${knockUser.name || "A User"}`,
      sender: knockUser.name,
      userId: userAuthorId,
      path: `${pathname}?invite=${knockUser.id}`,
    });

    call.join();

    setIsSetupComplete(true);
  }, [call, setIsSetupComplete, userAuthorId, knockUser, pathname]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(invitationLink);
    toast({
      title: "Link Copied",
      variant: "default",
    });
  }, [invitationLink]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <Button
          className="rounded-md bg-red-500 px-4 py-2.5 text-white"
          onClick={handleGoBack}
        >
          <ArrowLeft size={20} />
          Go Back
        </Button>
      </div>
      <div className="text-dark100_light900 mx-auto flex size-full max-w-5xl flex-col items-center justify-center gap-3">
        <h1 className="text-center text-2xl font-bold">Getting Ready</h1>
        <div className="px-12">
          <VideoPreview />
        </div>
        <div className="flex items-center justify-center gap-3">
          <label className="flex items-center justify-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={isMicCamToggled}
              onChange={(e) => setIsMicCamToggled(e.target.checked)}
            />
            Join with mic and camera off
          </label>
          <DeviceSettings />
        </div>
        <Button
          className="primary-gradient rounded-md px-4 py-2.5 text-white"
          onClick={handleJoin}
        >
          Join Video Call
        </Button>
        <Button
          className="rounded-md bg-dark-500 px-4 py-2.5 text-white"
          onClick={handleCopyLink}
        >
          Copy Invitation Link
        </Button>
      </div>
    </div>
  );
};

export default VideoCallSetup;
