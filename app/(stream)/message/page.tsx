import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import Message from "./components/Message";

export const metadata: Metadata = {
  title: "Message — DevOverflow",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { channelId, userId } = searchParams;
  return <Message channelId={channelId} userId={userId} />;
};

export default Page;
