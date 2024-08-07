"use client";
import React from "react";
import { QuestionProps } from "@/types";

import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";

const QuestionsContainer = ({
	questions,
	clerkId,
	type,
	mongoUserId,
}: {
	questions: QuestionProps[];
	clerkId: string | null | undefined;
	type?: "collection" | "skill";
	mongoUserId?: string;
}) => {
	const renderNoResult = () => {
		if (type === "collection") {
			return (
				<NoResult
					title="No Saved Problems Found"
					description="It appears that there are no saved problems in your collection at the moment 😔. Start exploring and saving problems that pique your interest 🌟"
					link="/home"
					linkTitle="Explore Problems"
				/>
			);
		}

		if (type === "skill") {
			return (
				<NoResult
					title="No Problems Found"
					description="It appears that there are no problems related to this skill at the moment 😔. Post a Problem and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
					link="/home"
					linkTitle="Explore Problems"
				/>
			);
		}

		return (
			<NoResult
				title="No Problems Found"
				description="Be the first to break the silence! 🚀 Post a Problem and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
				link="/post-problem"
				linkTitle="Post a Problem"
			/>
		);
	};
	return (
		<div className="mt-10 flex w-full flex-col gap-6">
			{questions.length > 0
				? questions.map((question) => (
						<QuestionCard
							key={question._id}
							_id={question._id}
							clerkId={clerkId}
							mongoUserId={mongoUserId}
							title={question.title}
							content={question.content}
							skills={question.skills}
							author={question.author}
							upvotes={question.upvotes}
							downvotes={question.downvotes}
							views={question.views}
							shares={question.shares}
							answers={question.answers}
							createdAt={new Date(question.createdAt)}
							mark={question.mark}
						/>
					))
				: renderNoResult()}
		</div>
	);
};

export default QuestionsContainer;
