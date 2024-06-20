import * as z from "zod";

export const QuestionValidation = z.object({
    title: z.string().min(5).max(130),
    explanation: z.string().min(20),
    skills: z.array(z.string().min(1).max(20)).min(1).max(3),
});

export const AnswerValidation = z.object({
    answer: z.string().min(10),
});

export const ProfileValidation = z.object({
    name: z.string().min(5).max(50),
    username: z.string().min(5).max(50),
    bio: z.union([z.string().min(5).max(50), z.literal("")]),
    portfolioWebsite: z.union([z.string().url(), z.literal("")]),
    whatsapp: z.union([z.string().min(5).max(50), z.literal("")]),
    googleMeet: z.union([z.string().min(5).max(50), z.literal("")]),
    location: z.union([z.string().min(5).max(50), z.literal("")]),
    zoom: z.union([z.string().min(5).max(50), z.literal("")]),
    skype: z.union([z.string().min(5).max(50), z.literal("")]),
    teams: z.union([z.string().min(5).max(50), z.literal("")]),
});
