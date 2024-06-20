import VideoCallRoom from "@/components/shared/VideoCallRoom";
import { getQuestionById } from "@/lib/actions/question.action";
import { ParamsProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community — DevOverflow",
};

const Page = async ({ params }: ParamsProps) => {
  const question = await getQuestionById({ questionId: params.id });
  const authorId = question.author.clerkId;

  return (
    <>
      <VideoCallRoom roomId={params.id} authorId={authorId} />
    </>
  );
};

export default Page;
