import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import MessageRoom from "./components/MessageRoom";

export const metadata: Metadata = {
  title: "Message — DevOverflow",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { channelId, userId } = searchParams;
  return <MessageRoom channelId={channelId} userId={userId} />;
};

export default Page;
