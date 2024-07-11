import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import Message from "./components/Message";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { identifyKnockUser } from "@/lib/actions/knock.action";

export const metadata: Metadata = {
  title: "Message — TheSkillGuru",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = searchParams;

  const { userId: clerkId } = auth();

  if (!clerkId) {
    return redirect("/sign-in");
  }

  const knockUser = await identifyKnockUser(clerkId);

  return <Message userId={userId} knockUser={knockUser} />;
};

export default Page;
