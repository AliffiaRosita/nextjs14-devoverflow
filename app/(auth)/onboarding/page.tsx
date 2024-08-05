import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import Profile from "@/components/forms/Profile";

import { createUserFromClerk, getUserById, getUserByUsername, updateUser } from "@/lib/actions/user.action";
import { getSkillsForForm } from "@/lib/actions/skill.action";
import { pushUnique } from "@/lib/utils";

const Page = async () => {
	const user = await currentUser();
	const existingUser = await getUserById({ userId: user?.id || "" });
    const cookieStore = cookies();

    const referral = cookieStore.get('referral');
    const referredUser = referral?.value ? await getUserByUsername(referral?.value) :  null;

    const saveReferredTo = async (id: string) => {
        if (!referredUser) return;

        const oldReferredTo = referredUser?.referredTo || [];
        const newReferredTo = pushUnique(oldReferredTo, id);

        await updateUser({
			clerkId: referredUser.clerkId,
			updateData: {
				referredTo: newReferredTo,
			},
			path: "",
		});
    }

    let mongoUser;

	if (!existingUser) {
		if (user) {
			console.log(user);
			mongoUser = await createUserFromClerk({
				id: user.id,
				emailAddresses: user.emailAddresses,
				imageUrl: user.imageUrl,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
                referredBy: referredUser?._id,
			});

            if (mongoUser) {
                await saveReferredTo(mongoUser._id);
            }
		}
	} else {
		mongoUser = existingUser;
	}
	// if (!user.id) return null;

	const skills = await getSkillsForForm();
	if (mongoUser?.onboarded) redirect("/home");

	return (
		<>
			<main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
				<h1 className="h1-bold text-dark100_light900">Onboarding</h1>
				<p className="base-medium text-dark100_light900 mt-3">
					Complete your profile now to use TheSkillGuru
				</p>

				<div className="background-light850_dark100 mt-9 p-10">
					<Profile
						clerkId={user?.id || ""}
						user={JSON.stringify(mongoUser)}
						skills={JSON.stringify(skills)}
						isOnboarding={true}
					/>
				</div>
			</main>
		</>
	);
};

export default Page;
