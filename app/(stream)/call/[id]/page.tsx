import { ParamsProps } from "@/types";
import { Metadata } from "next";
import VideoCallRoom from "./components/VideoCallRoom";

export const metadata: Metadata = {
  title: "Video Call — DevOverflow",
};

const Page = async ({ params }: ParamsProps) => {
  return <VideoCallRoom roomId={params.id} />;
};

export default Page;
