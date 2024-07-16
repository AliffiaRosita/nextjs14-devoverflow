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
					title="No Saved Questions Found"
					description="It appears that there are no saved questions in your collection at the moment 😔. Start exploring and saving questions that pique your interest 🌟"
					link="/home"
					linkTitle="Explore Questions"
				/>
			);
		}

		if (type === "skill") {
			return (
				<NoResult
					title="No Tag Questions Found"
					description="It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟"
					link="/home"
					linkTitle="Explore Questions"
				/>
			);
		}

		return (
			<NoResult
				title="No Questions Found"
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
