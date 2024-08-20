"use server";

import { revalidatePath } from "next/cache";

import mongoose, { FilterQuery } from "mongoose";

import User from "@/database/user.model";
import Skill from "@/database/skill.model";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";

import { connectToDatabase } from "@/lib/mongoose";
import { assignBadges } from "@/lib/utils";

import type {
	ClerkUser,
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetRelatedSkillUsersParams,
	GetSavedQuestionParams,
	GetUserByIdParams,
	GetUserStatsParams,
	ToggleSaveQuestionParams,
	UpdateUserParams,
} from "./shared.types";
import type { BadgeCriteriaType } from "@/types";
import { streamTokenProvider } from "./stream.actions";
import { identifyKnockUser } from "./knock.action";

export async function createUser(userData: CreateUserParams) {
	try {
		connectToDatabase();

		const newUser = await User.create(userData);

		return newUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function updateUser(params: UpdateUserParams) {
	try {
		connectToDatabase();

		const { clerkId, updateData, path, skills = [] } = params;

		const skillDocuments = [];
		// create the skills or get them if they already exist
		for (const skill of skills) {
			const existingSkill = await Skill.findOneAndUpdate(
				{ name: { $regex: new RegExp(`^${skill}$`, "i") } },
				{
					$setOnInsert: { name: skill },
				},
				{ upsert: true, new: true }
			);

			skillDocuments.push(existingSkill._id);
		}
		await User.findOneAndUpdate(
			{ clerkId },
			{
				$set: { ...updateData, skills: skillDocuments },
			},
			{
				new: true,
			}
		);

		if (path) {
			revalidatePath(path);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function updateUserById(params: UpdateUserParams) {
	try {
		connectToDatabase();

		const { clerkId, updateData, path } = params;


		await User.findOneAndUpdate(
			{ clerkId },
			{
				$set: { ...updateData },
			},
			{
				new: true,
			}
		);

		if (path) {
			revalidatePath(path);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function deleteUser(params: DeleteUserParams) {
	try {
		connectToDatabase();

		const { clerkId } = params;

		const user = await User.findOne({ clerkId });

		if (!user) {
			throw new Error("User not found");
		}

		// get user question ids

		// const userQuestionIds = await Question.find({ author: user._id }).distinct(
		//   "_id"
		// );

		// delete user questions
		await Question.deleteMany({ author: user._id });

		// TODO: Delete user answers, comments, etc

		const deletedUser = await User.findByIdAndDelete(user._id);

		return deletedUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserById(params: { userId: string | null}) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await User.findOne({
			clerkId: userId,
		}).populate({ path: "skills", model: Skill, select: "_id name" });

		return JSON.parse(JSON.stringify(user));
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserByUsername(username: string) {
	try {
		connectToDatabase();

		const user = await User.findOne({
			username,
		});

		return user;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserInfo(params: GetUserByIdParams) {
	try {
		connectToDatabase();

		const { userId } = params;

		const user = await User.findOne({ clerkId: userId });

		if (!user) {
			throw new Error("User not found");
		}

		const totalQuestions = await Question.countDocuments({
			author: user._id,
		});
		const totalAnswers = await Answer.countDocuments({ author: user._id });

		const [questionUpvotes] = await Question.aggregate([
			{ $match: { author: user._id } },
			{
				$project: {
					_id: 0,
					upvotes: { $size: "$upvotes" },
				},
			},
			{
				$group: {
					_id: null,
					totalUpvotes: { $sum: "$upvotes" },
				},
			},
		]);

		const [answerUpvotes] = await Answer.aggregate([
			{ $match: { author: user._id } },
			{
				$project: {
					_id: 0,
					upvotes: { $size: "$upvotes" },
				},
			},
			{
				$group: {
					_id: null,
					totalUpvotes: { $sum: "$upvotes" },
				},
			},
		]);

		const [questionViews] = await Question.aggregate([
			{ $match: { author: user._id } },
			{
				$group: {
					_id: null,
					totalViews: { $sum: "$views" },
				},
			},
		]);

		const [liveImpacts] = await Answer.aggregate([
			{ $match: { author: user._id } },
			{
				$group: {
					_id: null,
                    totalAnswers: { $sum: 1 }				
                },
			},
            {
                $project: {
                    _id: 0,
                    totalCount: {
						$cond: {
							if: { $lt: ["$totalAnswers", 3] },
							then: 0,
							else: { $floor: { $divide: ["$totalAnswers", 3] } }
						}
					}
                }
            }
		]);

		const [refLiveImpacts] = await Answer.aggregate([
			{ $match: { author: { $in: user.referredTo } } },
			{
				$group: {
					_id: "$author",
					totalAnswers: { $sum: 1 }
				},
			},
			{
				$project: {
					_id: 1,
					count: {
						$cond: {
							if: { $lt: ["$totalAnswers", 3] },
							then: 0,
							else: { $floor: { $divide: ["$totalAnswers", 3] } }
						}
					}
				}
			},
			{
				$group: {
					_id: null,
					totalCount: { $sum: "$count" }
				}
			},
			{
				$project: {
					_id: 0,
					totalCount: 1
				}
			}
		]);

		const criteria = [
			{
				type: "QUESTION_COUNT" as BadgeCriteriaType,
				count: totalQuestions,
			},
			{ type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
			{
				type: "QUESTION_UPVOTES" as BadgeCriteriaType,
				count: questionUpvotes?.totalUpvotes || 0,
			},
			{
				type: "ANSWER_UPVOTES" as BadgeCriteriaType,
				count: answerUpvotes?.totalUpvotes || 0,
			},
			{
				type: "TOTAL_VIEWS" as BadgeCriteriaType,
				count: questionViews?.totalViews || 0,
			},
		];

		const badgeCounts = assignBadges({ criteria });

		return {
			user,
			totalQuestions,
			totalAnswers,
			totalLiveImpacts: liveImpacts?.totalCount || 0,
			totalRefLiveImpacts: refLiveImpacts?.totalCount || 0,
			badgeCounts,
			reputation: user.reputation,
		};
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getAllUsers(params: GetAllUsersParams) {
	try {
		connectToDatabase();

		const { page = 1, pageSize = 10, filter, searchQuery } = params;

		// Calculate the number of users to skip based on the page number and page size
		const skipAmount = (page - 1) * pageSize;

		const query: FilterQuery<typeof User> = {};

		if (searchQuery) {
			query.$or = [
				{ name: { $regex: new RegExp(searchQuery, "i") } },
				{ username: { $regex: new RegExp(searchQuery, "i") } },
			];
		}

		let sortOptions = {};

		switch (filter) {
			case "new_users":
				sortOptions = { joinedAt: -1 };
				break;
			case "old_users":
				sortOptions = { joinedAt: 1 };
				break;
			case "top_contributors":
				sortOptions = { reputation: -1 };
				break;
			default:
				sortOptions = { joinedAt: -1 };
				break;
		}

		const users = await User.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);

		const totalUsers = await User.countDocuments(query);

		const isNext = totalUsers > skipAmount + users.length;

		return { users, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
	try {
		connectToDatabase();

		const { userId, questionId, path } = params;

		const user = await User.findById(userId);

		if (!user) {
			throw new Error("User not found");
		}

		const isQuestionSaved = user.saved.includes(questionId);

		if (isQuestionSaved) {
			// remove question from saved
			await User.findByIdAndUpdate(
				userId,
				{ $pull: { saved: questionId } },
				{ new: true }
			);
		} else {
			// add question to saved
			await User.findByIdAndUpdate(
				userId,
				{ $addToSet: { saved: questionId } },
				{ new: true }
			);
		}

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getSavedQuestions(params: GetSavedQuestionParams) {
	try {
		connectToDatabase();

		const {
			clerkId,
			page = 1,
			pageSize = 10,
			filter,
			searchQuery,
		} = params;

		// Calculate the number of questions to skip based on the page number and page size
		const skipAmount = (page - 1) * pageSize;

		const query: FilterQuery<typeof Question> = {};

		if (searchQuery) {
			query.$or = [{ title: { $regex: new RegExp(searchQuery, "i") } }];
		}

		let sortOptions = {};

		switch (filter) {
			case "most_recent":
				sortOptions = { createdAt: -1 };
				break;
			case "oldest":
				sortOptions = { createdAt: 1 };
				break;
			case "most_voted":
				sortOptions = { upvotes: -1 };
				break;
			case "most_viewed":
				sortOptions = { views: -1 };
				break;
			case "most_answered":
				sortOptions = { answers: -1 };
				break;
			default:
				break;
		}

		const user = await User.findOne({ clerkId }).populate({
			path: "saved",
			match: query,
			options: {
				sort: sortOptions,
				skip: skipAmount,
				limit: pageSize + 1, // +1 to check if there is next page
			},
			populate: [
				{ path: "skills", model: Skill, select: "_id name" },
				{
					path: "author",
					model: User,
					select: "_id clerkId name picture",
				},
			],
		});

		if (!user) {
			throw new Error("User not found");
		}

		const savedQuestions = user.saved;

		const isNext = user.saved.length > pageSize;

		return { questions: savedQuestions, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserAnswers(params: GetUserStatsParams) {
	try {
		connectToDatabase();

		const { userId, page = 1, pageSize = 10 } = params;

		const totalAnswers = await Answer.countDocuments({
			author: userId,
		});

		// Calculate the number of answers to skip based on the page number and page size
		const skipAmount = (page - 1) * pageSize;

		const userAnswers = await Answer.find({ author: userId })
			.sort({ upvotes: -1 })
			.skip(skipAmount)
			.limit(pageSize)
			.populate("question", "_id title")
			.populate("author", "_id clerkId name picture");

		const isNext = totalAnswers > skipAmount + userAnswers.length;

		return { totalAnswers, answers: userAnswers, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserQuestions(params: GetUserStatsParams) {
	try {
		connectToDatabase();

		const { userId, page = 1, pageSize = 10 } = params;

		const totalQuestions = await Question.countDocuments({
			author: userId,
		});

		// Calculate the number of questions to skip based on the page number and page size
		const skipAmount = (page - 1) * pageSize;

		const userQuestions = await Question.find({ author: userId })
			.sort({ createdAt: -1, views: -1, upvotes: -1 })
			.skip(skipAmount)
			.limit(pageSize)
			.populate("skills", "_id name")
			.populate("author", "_id clerkId name picture");

		const isNext = totalQuestions > skipAmount + userQuestions.length;

		return { totalQuestions, questions: userQuestions, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getStreamUserData(params: { userId: string }) {
	try {
		connectToDatabase();
		const mongoUser = await User.findOne({ clerkId: params.userId });

		if (!mongoUser) return null;

		const streamUser = {
			id: mongoUser.clerkId,
			role: "user",
			custom: {
				email: mongoUser.email,
				username: mongoUser.username,
			},
			name: mongoUser.name || mongoUser.username,
			image: mongoUser.pictures,
		};

		return streamUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function createUserFromClerk(params: ClerkUser) {
	try {
		const {
            id,
            emailAddresses,
            imageUrl,
            username,
            firstName,
            lastName,
            referredBy,
        } = params;

		const parts =
			emailAddresses !== null
				? emailAddresses[0].emailAddress.split("@")
				: "";
		const fullName = () => {
			if (!firstName) {
				return parts[0];
			} else {
				return `${firstName}${lastName ? ` ${lastName}` : ""}`;
			}
		};
		// create a new user in database
		await createUser({
			clerkId: id || "",
			name: fullName(),
			username: username || parts[0],
			email:
				emailAddresses !== null ? emailAddresses[0].emailAddress : "",
			picture: imageUrl,
			skills: [],
            referredBy,
		});

		await streamTokenProvider(id || "");
		await identifyKnockUser(id || "");
		return await getUserById({ userId: id || "" });
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getReferralUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase();

        const { page = 1, pageSize = 12, filter, searchQuery, clerkId } = params;

        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof User> = {};

        let sortOptions = {};

		switch (filter) {
			case "new_users":
				sortOptions = { joinedAt: -1 };
				break;
			case "old_users":
				sortOptions = { joinedAt: 1 };
				break;
			case "top_contributors":
				sortOptions = { reputation: -1 };
				break;
			default:
				break;
		}

		const user = await User.findOne({ clerkId });

        query.$and = [{ _id: { $in: user.referredTo } }];

        if (searchQuery) {
            query.$and = [
                ...query.$and,
                {
                    $or: [
                        { name: { $regex: new RegExp(searchQuery, 'i') } },
                        { username: { $regex: new RegExp(searchQuery, 'i') } },
                    ],
                },
            ];
        }

        const usersData = await User.find(query)
			.populate({ path: "skills", model: Skill, select: "_id name" })
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

			const users = JSON.parse(JSON.stringify(usersData));

        const totalUsers = await User.countDocuments(query);

        const isNext = totalUsers > skipAmount + users.length;

        return { users, isNext };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getRelatedSkillUsers(params: GetRelatedSkillUsersParams) {
    try {
        await connectToDatabase();

        const { skills = [], limit = 3, userId } = params;

        const matchQuery: FilterQuery<typeof User> = {
            $and: [
                { skills: { $in: skills } },
                { isAcceptCalls: true },
                { _id: { $ne: new mongoose.Types.ObjectId(userId) } },
            ],
        };

        const usersData = await User.aggregate([
            { $match: matchQuery },
            { $sample: { size: limit } },
            { $project: { _id: 1, clerkId: 1, name: 1 } },
        ]);

        const users = JSON.parse(JSON.stringify(usersData));

        return users;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
