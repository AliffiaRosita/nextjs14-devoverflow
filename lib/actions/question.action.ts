"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { FilterQuery } from "mongoose";

import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

import { connectToDatabase } from "@/lib/mongoose";

import type {
    CreateQuestionParams,
    DeleteQuestionParams,
    EditQuestionParams,
    GetQuestionByIdParams,
    GetQuestionsParams,
    QuestionVoteParams,
    RecommendedParams,
} from "./shared.types";
import Skill from "@/database/skill.model";
import Question from "@/database/question.model";

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDatabase();

        const { title, content, skills, author, path } = params;

        // create new question
        const question = await Question.create({
            title,
            content,
            author,
        });

        const skillDocuments = [];
        let newSkillCounter = 0;

        // create the skills or get them if they already exist
        for (const skill of skills) {
            const isSkillAlreadyExist = await Skill.exists({
                name: { $regex: new RegExp(`^${skill}$`, "i") },
            });

            if (!isSkillAlreadyExist) newSkillCounter++;

            const existingSkill = await Skill.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${skill}$`, "i") } },
                {
                    $setOnInsert: { name: skill },
                    $push: { questions: question._id },
                },
                { upsert: true, new: true }
            );

            skillDocuments.push(existingSkill._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { skills: { $each: skillDocuments } },
        });

        // create an interaction record for the user's ask_question action
        await Interaction.create({
            user: author,
            action: "ask_question",
            question: question._id,
            skills: skillDocuments,
        });

        // increment author's reputation by +S for creating a question
        await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

        // increment user's reputation by +S for creating a new tag (S = 3)
        if (newSkillCounter > 0) {
            await User.findByIdAndUpdate(author, {
                $inc: { reputation: newSkillCounter * 3 },
            });
        }

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, title, content, path } = params;

        const question = await Question.findById(questionId).populate("skills");

        if (!question) {
            throw new Error("Question not found");
        }

        question.title = title;
        question.content = content;

        await question.save();

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, path, isQuestionPath = false } = params;

        const question = await Question.findById({ _id: questionId });

        if (!question) {
            throw new Error("Question not found");
        }

        await Question.deleteOne({ _id: questionId });

        await Answer.deleteMany({ question: questionId });

        await Interaction.deleteMany({ question: questionId });

        await Skill.updateMany(
            { questions: questionId },
            { $pull: { questions: questionId } }
        );

        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: -10 },
        });

        if (isQuestionPath) {
            redirect("/home");
        } else {
            revalidatePath(path);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        connectToDatabase();

        const { questionId } = params;

        const question = await Question.findById(questionId)
            .populate({ path: "skills", model: Skill, select: "_id name" })
            .populate({
                path: "author",
                model: User,
                select: "_id clerkId name picture",
            });

        return question;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

        const { page = 1, pageSize = 10, filter, searchQuery } = params;

        // Calculate the number of questions to skip based on the page number and page size
        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof Question> = {};

        if (searchQuery) {
            query.$or = [
                {
                    title: { $regex: new RegExp(searchQuery, "i") },
                    content: { $regex: new RegExp(searchQuery, "i") },
                },
            ];
        }

        let sortOptions = {};

        switch (filter) {
            case "newest":
                sortOptions = { createdAt: -1 };
                break;
            case "frequent":
                sortOptions = { views: -1 };
                break;
            case "unanswered":
                query.answers = { $size: 0 };
                break;
            default:
                break;
        }

        const questions = await Question.find(query)
            .populate({ path: "skills", model: Skill })
            .populate({ path: "author", model: User })
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalQuestions = await Question.countDocuments(query);

        const isNext = totalQuestions > skipAmount + questions.length;

        return { questions, isNext };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = {
                $pull: { upvotes: userId },
            };
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId },
            };
        } else {
            updateQuery = { $addToSet: { upvotes: userId } };
        }

        const question = await Question.findByIdAndUpdate(
            questionId,
            updateQuery,
            {
                new: true,
            }
        );

        if (!question) {
            throw new Error("Question not found");
        }

        if (userId !== question.author.toString()) {
            // increment user's reputation by +S for upvoting/revoking an upvote to the question (S = 1)
            await User.findByIdAndUpdate(userId, {
                $inc: { reputation: hasupVoted ? -2 : 2 },
            });

            // increment author's reputation by +S for upvoting/revoking an upvote to the question (S = 10)
            await User.findByIdAndUpdate(question.author, {
                $inc: { reputation: hasupVoted ? -10 : 10 },
            });
        }

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
            };
        } else if (hasupVoted) {
            updateQuery = {
                $pull: { upvotes: userId },
                $push: { downvotes: userId },
            };
        } else {
            updateQuery = { $addToSet: { downvotes: userId } };
        }

        const question = await Question.findByIdAndUpdate(
            questionId,
            updateQuery,
            {
                new: true,
            }
        );

        if (!question) {
            throw new Error("Question not found");
        }

        if (userId !== question.author.toString()) {
            // decrement user's reputation by +S for downvoting/revoking an downvote to the question (S = 1)
            await User.findByIdAndUpdate(userId, {
                $inc: { reputation: hasdownVoted ? 2 : -2 },
            });

            // decrement author's reputation by +S for downvoting/revoking an downvote to the question (S = 10)
            await User.findByIdAndUpdate(question.author, {
                $inc: { reputation: hasdownVoted ? -10 : 10 },
            });
        }

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getHotQuestions() {
    try {
        connectToDatabase();

        const hotQuestions = await Question.find({})
            .sort({
                views: -1,
                upvotes: -1,
            })
            .limit(5);

        return hotQuestions;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 20, searchQuery } = params;

        // find user
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            throw new Error("user not found");
        }

        const skipAmount = (page - 1) * pageSize;

        // Find the user's interactions
        const userInteractions = await Interaction.find({ user: user._id })
            .populate("skills")
            .exec();

        // Extract tags from user's interactions
        const userTags = userInteractions.reduce((skills, interaction) => {
            if (interaction.skills) {
                skills = skills.concat(interaction.skills);
            }
            return skills;
        }, []);

        // Get distinct tag IDs from user's interactions
        const distinctUserTagIds = [
            // @ts-ignore
            ...new Set(userTags.map((tag: any) => tag._id)),
        ];

        const query: FilterQuery<typeof Question> = {
            $and: [
                { skill: { $in: distinctUserTagIds } }, // Questions with user's tags
                { author: { $ne: user._id } }, // Exclude user's own questions
            ],
        };

        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
            ];
        }

        const totalQuestions = await Question.countDocuments(query);

        const recommendedQuestions = await Question.find(query)
            .populate({
                path: "skills",
                model: Skill,
            })
            .populate({
                path: "author",
                model: User,
            })
            .skip(skipAmount)
            .limit(pageSize);

        const isNext =
            totalQuestions > skipAmount + recommendedQuestions.length;

        return { questions: recommendedQuestions, isNext };
    } catch (error) {
        console.error("Error getting recommended questions:", error);
        throw error;
    }
}
