"use client";
import { useEffect, useState } from "react";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const call = useCall();
  const router = useRouter();

  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );
  }

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

  return (
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
        onClick={() => {
          call.join();

          setIsSetupComplete(true);
        }}
      >
        Join Video Call
      </Button>
      or
      <Button
        className="rounded-md bg-red-500 px-4 py-2.5 text-white"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowLeft size={20} />
        Go Back
      </Button>
    </div>
  );
};

export default MeetingSetup;
