import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { URLProps } from "@/types";

import { getQuestionById } from "@/lib/actions/question.action";

import VideoCall from "./components/VideoCall";
import { identifyKnockUser } from "@/lib/actions/knock.action";
import { getRelatedSkillUsers } from "@/lib/actions/user.action";

export const metadata: Metadata = {
	title: "Video Call — TheSkillGuru",
};

const Page = async ({ params, searchParams }: URLProps) => {
	const { userId: clerkId } = auth();

	if (!clerkId) {
		return redirect("/sign-in");
	}

	const knockUserData = await identifyKnockUser(clerkId)

	const knockUser = JSON.parse(JSON.stringify(knockUserData));

	const result = await getQuestionById({ questionId: params.id });

	if (!result) return null;

	const { invite: inviteId, instant: instantCall } = searchParams;

	if(result?.author.clerkId === knockUser.id && instantCall) {
		const relatedSkillUsers = await getRelatedSkillUsers({
			skillIds: result.skills
		});
    }

	return (
		<VideoCall
			inviteId={inviteId}
			questionId={params.id}
			userAuthorId={result?.author.clerkId}
			userId={clerkId}
			knockUser={knockUser}
			relatedSkillUsers={relatedSkillUsers}
		/>
	);
};

export default Page;
