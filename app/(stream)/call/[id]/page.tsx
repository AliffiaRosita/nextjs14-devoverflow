import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { RelatedSkillUsers, URLProps } from "@/types";

import { getQuestionById } from "@/lib/actions/question.action";

import VideoCall from "./components/VideoCall";
import { identifyKnockUser } from "@/lib/actions/knock.action";
import { getRelatedSkillUsers, getUserById } from "@/lib/actions/user.action";

export const metadata: Metadata = {
	title: "Video Call — TheSkillGuru",
};

const Page = async ({ params, searchParams }: URLProps) => {
	const { userId: clerkId } = auth();

	if (!clerkId) {
		return redirect("/sign-in");
	}

    const mongoUser = await getUserById({ userId: clerkId });

	const knockUserData = await identifyKnockUser(clerkId)

	const knockUser = JSON.parse(JSON.stringify(knockUserData));

	const result = await getQuestionById({ questionId: params.id });

	if (!result) return null;

	const { invite: inviteId, instant: instantCall } = searchParams;

    const invitedMentors = instantCall
        ? await getRelatedSkillUsers({
              skills: result.skills.map((skill: RelatedSkillUsers) => (skill._id)),
          })
        : [];

	return (
        <VideoCall
            inviteId={inviteId}
            questionId={params.id}
            userAuthorId={result?.author.clerkId}
            userId={clerkId}
            knockUser={knockUser}
            mongoUser={mongoUser}
            invitedMentors={invitedMentors}
        />
	);
};

export default Page;
