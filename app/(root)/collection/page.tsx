import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import QuestionsContainer from "@/components/shared/QuestionsContainer";

import { getSavedQuestions, getUserById } from "@/lib/actions/user.action";

import { QuestionFilters } from "@/constants/filters";

import type { SearchParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Collection — DevOverflow",
};

export default async function Collection({ searchParams }: SearchParamsProps) {
    const { userId: clerkId } = auth();

    if (!clerkId) return null;

    const mongoUser = await getUserById({ userId: clerkId });
    if (!mongoUser?.onboarded) redirect("/onboarding");

    const result = await getSavedQuestions({
        clerkId,
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: searchParams.page ? +searchParams.page : 1,
    });


    const questions = JSON.parse(JSON.stringify(result.questions));

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchbar
                    route="/collection"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for questions"
                    otherClasses="flex-1"
                />

                <Filter
                    filters={QuestionFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <QuestionsContainer type="collection" questions={questions} clerkId={clerkId} />

            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext}
                />
            </div>
        </>
    );
}
