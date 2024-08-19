import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { InvitedMentors, URLProps } from "@/types";

import { getQuestionById } from "@/lib/actions/question.action";

import VideoCall from "./components/VideoCall";
import { identifyKnockUser } from "@/lib/actions/knock.action";
import { getRelatedSkillUsers, getUserById } from "@/lib/actions/user.action";
import { createVideoCall, getVideoCallByRoomId, updateVideoCall } from "@/lib/actions/videoCall.action";
import { Skill, VideoCallData } from "@/lib/actions/shared.types";

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

	const question = await getQuestionById({ questionId: params.id });

	if (!question) return null;

    const questionId = params.id;

    const userAuthorClerkId = question?.author.clerkId;
    const userAuthor = question?.author;

    const userId = clerkId;

    const isUserAuthor = userId === userAuthorClerkId;

	const { invite: inviteId } = searchParams;

    const invitedUsers = isUserAuthor
        ? await getRelatedSkillUsers({
              skills: question.skills.map((skill: Skill) => (skill._id)),
          })
        : [userAuthor];

    const callRoomId = `${questionId}-${inviteId || (isUserAuthor ? userAuthorClerkId : userId)}`;

    const validateUserAccess = async (videoCallData: VideoCallData) => {
        if (!videoCallData) {
            const invitedIds = invitedUsers.map((member: InvitedMentors) => member._id);
            await createVideoCall({
                callRoomId,
                invitedIds,
                memberIds: [],
                createdBy: mongoUser._id,
                questionId,
                callInitiator: isUserAuthor ? 'author' : 'solver',
            });

            return true;
        }

        if (
            videoCallData.invitedIds.includes(mongoUser._id) &&
            !videoCallData.memberIds.length
        ) {
            await updateVideoCall({
                callRoomId,
                updateData: {
                    memberIds: [mongoUser._id],
                },
            });
            return true;
        } else if (
            videoCallData.invitedIds.includes(mongoUser._id) &&
            videoCallData.memberIds.includes(mongoUser._id)
        ) {
            return true;
        } else if (videoCallData.createdBy === mongoUser._id) {
            return true;
        } else {
            return false;
        }
    };

    const videoCallData = await getVideoCallByRoomId({callRoomId})

    const isUserAllowedJoin = await validateUserAccess(videoCallData)

    if(!isUserAllowedJoin){
        return <>you dont have access</>
    }

	return (
        <VideoCall
            questionId={questionId}
            userAuthorId={userAuthorClerkId}
            knockUser={knockUser}
            mongoUser={mongoUser}
            invitedMentors={invitedUsers}
            callRoomId={callRoomId}
        />
	);
};

export default Page;
