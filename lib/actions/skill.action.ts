'use server';

import { FilterQuery } from 'mongoose';

import Skill from '@/database/skill.model';
import Question from '@/database/question.model';
import User from '@/database/user.model';

import { connectToDatabase } from '@/lib/mongoose';

import type {
    GetAllTagsParams,
    GetQuestionByTagIdParams,
    GetTopInteractedTagsParams,
    GetTagByIdParams,
} from './shared.types';
import { Tag } from 'lucide-react';

export async function getAllSkills(params: GetAllTagsParams) {
    try {
        connectToDatabase();

        const { page = 1, pageSize = 12, filter, searchQuery } = params;

        // Calculate the number of tags to skip based on the page number and page size
        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof Tag> = {};

        if (searchQuery) {
            query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
        }

        let sortOptions = {};

        switch (filter) {
            case 'popular':
                sortOptions = { questions: -1 };
                break;
            case 'recent':
                sortOptions = { createdAt: -1 };
                break;
            case 'name':
                sortOptions = { name: 1 };
                break;
            case 'old':
                sortOptions = { createdAt: 1 };
                break;
            default:
                break;
        }

        const skills = await Skill.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalSkills = await Skill.countDocuments(query);

        const isNext = totalSkills > skipAmount + skills.length;

        return { skills, isNext };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getSkillById(params: GetTagByIdParams) {
    try {
        connectToDatabase();

        const { skillId } = params;

        const skill = await Skill.findOne({
            _id: skillId,
        });

        return skill;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getQuestionsBySkillId(params: GetQuestionByTagIdParams) {
    try {
        connectToDatabase();

        const { skillId, page = 1, pageSize = 10, searchQuery } = params;

        // Calculate the number of questions to skip based on the page number and page size
        const skipAmount = (page - 1) * pageSize;

        const skillFilter: FilterQuery<typeof Tag> = { _id: skillId };

        const skill = await Skill.findOne(skillFilter).populate({
            path: 'questions',
            model: Question,
            match: searchQuery
                ? { title: { $regex: searchQuery, $options: 'i' } }
                : {},
            options: {
                sort: { createdAt: -1 },
                skip: skipAmount,
                limit: pageSize + 1, // +1 to check if there is next page
            },
            populate: [
                { path: 'skills', model: Skill, select: '_id name' },
                {
                    path: 'author',
                    model: User,
                    select: '_id clerkId name picture',
                },
            ],
        });

        if (!skill) {
            throw new Error('skill not found');
        }

        const questions = skill.questions;

        const isNext = skill.questions.length > pageSize;

        return { skillTitle: skill.name, questions, isNext };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTopPopularSkill() {
    try {
        connectToDatabase();

        const popularSkills = await Skill.aggregate([
            {
                $project: {
                    name: 1,
                    numberOfQuestions: { $size: '$questions' },
                },
            },
            { $sort: { numberOfQuestions: -1 } },
            { $limit: 5 },
        ]);

        return popularSkills;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTopInteractedSkill(
    params: GetTopInteractedTagsParams,
) {
    try {
        connectToDatabase();

        const { userId } = params;

        const user = await User.findById(userId);

        if (!user) throw new Error('User not found');

        // // find interactions for the user and groups by tags
        // const interactions = await Question.aggregate([
        // 	{ $match: { author: userId } },
        // 	{ $unwind: "$skills" },
        // 	{ $group: { _id: "$skills", count: { $sum: 1 } } },
        // 	{ $sort: { count: -1 } },
        // 	{ $limit: limit },
        // ]);

        // find the tags from the interactions
        const skills = await Skill.find({
            _id: { $in: user.skills },
        });

        return skills;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getSkillsForForm() {
    try {
        connectToDatabase();

        const skill = await Skill.find().sort({ createdOn: -1 });

        return skill;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
