import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { URLProps } from "@/types";

import { getQuestionById } from "@/lib/actions/question.action";

import VideoCall from "./components/VideoCall";
import { identifyKnockUser } from "@/lib/actions/knock.action";

export const metadata: Metadata = {
	title: "Video Call — TheSkillGuru",
};

const Page = async ({ params, searchParams }: URLProps) => {
	const { userId: clerkId } = auth();

	if (!clerkId) {
		return redirect("/sign-in");
	}

	const knockUser = await identifyKnockUser(clerkId)

	const result = await getQuestionById({ questionId: params.id });

	if (!result) return null;

	const inviteId = searchParams.invite;

	return (
		<VideoCall
			inviteId={inviteId}
			questionId={params.id}
			userAuthorId={result?.author.clerkId}
			userId={clerkId}
			knockUser={knockUser}
		/>
	);
};

export default Page;
