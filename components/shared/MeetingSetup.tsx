"use client";
import { useEffect, useState } from "react";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { Button } from "../ui/button";
import Alert from "./Alert";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();

  const call = useCall();

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

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Video call has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  return (
    <div className="text-dark100_light900 mx-auto flex size-full max-w-5xl flex-col items-center justify-center gap-3">
      <div className="card-wrapper flex w-full flex-col items-center gap-2 rounded-[10px] p-9 sm:px-11">
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
      </div>
    </div>
  );
};

export default MeetingSetup;
