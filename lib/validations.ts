import * as z from 'zod';

export const QuestionValidation = z.object({
    title: z.string().min(5),
    explanation: z.string().max(1500),
    // skills: z.array(z.string().min(1)).min(1),
    mark: z.string(),
});

export const AnswerValidation = z.object({
    answer: z.string().min(10),
});

export const ProfileValidation = z.object({
    name: z.string().max(50).nonempty({ message: `Name can't be empty` }),
    username: z
        .string()
        .max(50)
        .nonempty({ message: `Username can't be empty` }),
    bio: z.union([z.string(), z.literal('')]),
    portfolioWebsite: z.union([z.string().url(), z.literal('')]),
    whatsapp: z
        .string()
        .nonempty({ message: 'Whatsapp number is required' }),
        // .regex(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number format' }),
    googleMeet: z.union([z.string().min(5).max(50), z.literal('')]),
    location: z.union([z.string().min(5).max(50), z.literal('')]),
    zoom: z.union([z.string().min(5).max(50), z.literal('')]),
    skype: z.union([z.string().min(5).max(50), z.literal('')]),
    teams: z.union([z.string().min(5).max(50), z.literal('')]),
    // skills: z.array(z.string().min(1)).min(1),
});
