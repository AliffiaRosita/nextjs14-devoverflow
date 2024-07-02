import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import Message from "./components/Message";

export const metadata: Metadata = {
  title: "Message — DevOverflow",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = searchParams;
  return <Message userId={userId} />;
};

export default Page;
