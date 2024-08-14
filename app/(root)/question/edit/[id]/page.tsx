import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Question from '@/components/forms/Question';

import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';

import type { ParamsProps } from '@/types';
import type { Metadata } from 'next';
import { getSkillsForForm } from '@/lib/actions/skill.action';

export const metadata: Metadata = {
	title: "Edit Problem — TheSkillGuru",
};

const Page = async ({ params }: ParamsProps) => {
    const { userId } = auth();

    if (!userId) return null;
    const skills = await getSkillsForForm();
    const mongoUser = await getUserById({ userId });
    if (!mongoUser?.onboarded) redirect('/onboarding');

    const result = await getQuestionById({ questionId: params.id });

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Edit Problem</h1>
            <div className="mt-9">
                <Question
                    type="Edit"
                    mongoUserId={mongoUser._id}
                    questionDetails={JSON.stringify(result)}
                    skills={JSON.stringify(skills)}
                />
            </div>
        </>
    );
};

export default Page;
