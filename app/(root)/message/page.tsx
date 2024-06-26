import MessageRoom from "@/components/shared/MessageRoom";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message — DevOverflow",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { channelId, userId } = searchParams;
  return <MessageRoom channelId={channelId} userId={userId} />;
};

export default Page;
