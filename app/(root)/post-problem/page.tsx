import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Question from "@/components/forms/Question";

import { getUserById } from "@/lib/actions/user.action";
import type { Metadata } from "next";
import { getSkillsForForm } from "@/lib/actions/skill.action";

export const metadata: Metadata = {
	title: "Post a Problem — TheSkillGuru",
};

const Page = async () => {
	const { userId } = auth();

	if (!userId) return null;
	const skills = await getSkillsForForm();
	const mongoUser = await getUserById({ userId });
	if (!mongoUser?.onboarded) redirect("/onboarding");

	return (
		<div>
			<h1 className="h1-bold text-dark100_light900">Post a Problem</h1>

			<div className="mt-9">
				<Question
					type="create"
					mongoUserId={JSON.stringify(mongoUser._id)}
					skills={JSON.stringify(skills)}
				/>
			</div>
		</div>
	);
};

export default Page;
