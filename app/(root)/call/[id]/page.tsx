import VideoCallRoom from "@/components/shared/VideoCallRoom";
import { ParamsProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community — DevOverflow",
};

const Page = async ({ params }: ParamsProps) => {
  return <VideoCallRoom roomId={params.id} />;
};

export default Page;
