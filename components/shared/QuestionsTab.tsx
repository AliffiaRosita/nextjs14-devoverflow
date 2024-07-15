import Pagination from "@/components/shared/Pagination";

import { getUserQuestions } from "@/lib/actions/user.action";

import type { UserId } from "@/lib/actions/shared.types";
import type { SearchParamsProps } from "@/types";
import QuestionsContainer from "./QuestionsContainer";

interface Props extends SearchParamsProps, UserId {
    clerkId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
    const result = await getUserQuestions({
        userId,
        page: searchParams.page ? +searchParams.page : 1,
    });

    const questions = JSON.parse(JSON.stringify(result.questions));

    return (
        <>
            <QuestionsContainer questions={questions} clerkId={clerkId} mongoUserId={userId} />

            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext}
                />
            </div>
        </>
    );
};

export default QuestionsTab;
