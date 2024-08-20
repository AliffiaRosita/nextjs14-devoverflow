import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { InvitedUsers, URLProps } from "@/types";

import { getQuestionById } from "@/lib/actions/question.action";

import VideoCall from "./components/VideoCall";
import { identifyKnockUser } from "@/lib/actions/knock.action";
import { getRelatedSkillUsers, getUserById } from "@/lib/actions/user.action";
import { createVideoCall, getVideoCallByRoomId, updateVideoCall } from "@/lib/actions/videoCall.action";
import { Skill, VideoCallData } from "@/lib/actions/shared.types";
import VideoCallError from "./components/VideoCallError";

export const metadata: Metadata = {
	title: "Video Call — TheSkillGuru",
};

const Page = async ({ params, searchParams }: URLProps) => {
	const { userId: clerkId } = auth();

	if (!clerkId) {
		return redirect("/sign-in");
	}

    const mongoUser = await getUserById({ userId: clerkId });

    if (!mongoUser?.onboarded) redirect("/onboarding");

	const knockUserData = await identifyKnockUser(clerkId)

	const knockUser = JSON.parse(JSON.stringify(knockUserData));

	const question = await getQuestionById({ questionId: params.id });

	if (!question) return null;

    const questionId = params.id;

    const userAuthorClerkId = question?.author.clerkId;
    const userAuthor = JSON.parse(JSON.stringify(question?.author));

    const userId = clerkId;

    const isUserAuthor = userId === userAuthorClerkId;

	const { invite: inviteId } = searchParams;

    const skills = question.skills.map((skill: Skill) => (skill._id));

    const invitedUsers = isUserAuthor
        ? await getRelatedSkillUsers({
              skills,
              userId: mongoUser._id
          })
        : [userAuthor];

    const callRoomId = `${questionId}-${inviteId || (isUserAuthor ? userAuthorClerkId : userId)}`;

    const validateUserAccess = async (videoCallData: VideoCallData) => {
        //* user created a video call
        if (!videoCallData) {
            const invitedIds = invitedUsers.map((member: InvitedUsers) => member._id);
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

        //* an invited user join the video call
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
        } 

        //* no invited user available, user join the video call via invitation link instead
        if (!videoCallData.invitedIds.length && !videoCallData.memberIds.length) {
            await updateVideoCall({
                callRoomId,
                updateData: {
                    memberIds: [mongoUser._id],
                },
            });

            return true;
        }
 
        //* video call registered member can join call
        if (videoCallData.memberIds.includes(mongoUser._id)) {
            return true;
        }

        //* video call creator can join call
        if (videoCallData.createdBy === mongoUser._id) {
            return true;
        }

        return false;
    };

    const videoCallData = await getVideoCallByRoomId({callRoomId})

    const isUserAllowedJoin = await validateUserAccess(videoCallData)

    if(!isUserAllowedJoin){
        return <VideoCallError message="Other Mentor picked up the call. You can pick the next one!" />
    }

	return (
        <VideoCall
            questionId={questionId}
            userAuthorClerkId={userAuthorClerkId}
            knockUser={knockUser}
            mongoUser={mongoUser}
            invitedUsers={invitedUsers}
            callRoomId={callRoomId}
        />
	);
};

export default Page;
