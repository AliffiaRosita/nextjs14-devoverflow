import { auth } from "@clerk/nextjs/server";

import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import QuestionsContainer from "@/components/shared/QuestionsContainer";

import {
	getSkillById,
	getQuestionsBySkillId,
} from "@/lib/actions/skill.action";

import type { URLProps } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: Omit<URLProps, "searchParams">): Promise<Metadata> {
	const tag = await getSkillById({ skillId: params.id });

	return {
		title: `Posts by skill '${tag.name}' — TheSkillGuru`,
		description: tag.description || `Questions tagged with ${tag.name}`,
	};
}

const Page = async ({ params, searchParams }: URLProps) => {
	const { userId: clerkId } = auth();

	const result = await getQuestionsBySkillId({
		skillId: params.id,
		searchQuery: searchParams.q,
		page: searchParams.page ? +searchParams.page : 1,
	});

	const questions = JSON.parse(JSON.stringify(result.questions));

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">
				{result.skillTitle}
			</h1>
			<div className="mt-11 w-full">
				<LocalSearchbar
					route={`/skills/${params.id}`}
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search tag questions"
					otherClasses="flex-1"
				/>
			</div>

			<QuestionsContainer
				type="skill"
				questions={questions}
				clerkId={clerkId}
			/>

			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNext={result.isNext}
				/>
			</div>
		</>
	);
};

export default Page;
