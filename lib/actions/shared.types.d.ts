import { Schema } from "mongoose";

import { IUser } from "@/database/user.model";
import { ISkill } from "@/database/skill.model";
import { IVideoCall } from "@/database/videoCall.model";

/**
 * Common interfaces used in actions
 */
interface ClerkId {
    clerkId: string;
}

interface UserId {
    userId: string;
}

interface QuestionId {
    questionId: string;
}

interface AnswerId {
    answerId: string;
}

interface OptionalPage {
    page?: number;
}

interface OptionalPageSize {
    pageSize?: number;
}

interface OptionalSearch {
    searchQuery?: string;
}

interface OptionalFilter {
    filter?: string;
}

interface Path {
    path: string;
}

interface Content {
    content?: string;
}

interface Voting {
    hasupVoted: boolean;
    hasdownVoted: boolean;
}

interface Searchable
    extends OptionalPage,
        OptionalPageSize,
        OptionalSearch,
        ClerkId,
        OptionalFilter {}

/**
 * Interfaces for user actions
 */
export interface CreateUserParams extends ClerkId {
    name: string;
    username: string;
    email: string;
    picture: string;
    skills: string[];
    referredBy?: string;
}

export interface GetUserByIdParams extends UserId {}

export interface GetAllUsersParams extends Searchable {}

export interface GetRelatedSkillUsersParams {
    limit?: number;
    skills: string[];
}

export interface GetJobsParams extends Searchable {
    location?: string;
    remote?: boolean | string;
    wage?: boolean | string;
    skills?: boolean | string;
}

export interface UpdateUserParams extends ClerkId, Path {
    updateData: Partial<IUser>;
    skillsTeach?: string[];
    skillsLearn?: string[];
}

export interface DeleteUserParams extends ClerkId {}

export interface EmailAddress {
    emailAddress: string;
}
export interface ClerkUser {
    id: string | null;
    emailAddresses: EmailAddress[] | null;
    imageUrl: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    referredBy?: string;
}
export interface MongoUser extends Partial<IUser> {}
export interface Skill extends Partial<ISkill> {}

export interface GetUserStatsParams
    extends UserId,
        OptionalPage,
        OptionalPageSize {}

export interface ToggleSaveQuestionParams extends UserId, QuestionId, Path {}

export interface GetSavedQuestionParams
    extends ClerkId,
        OptionalPage,
        OptionalPageSize,
        OptionalSearch,
        OptionalFilter {}

/**
 * Interfaces for question actions
 */
export interface GetQuestionsParams extends Searchable {}

export type SortOptions = Record<string, 1 | -1>;
export interface CreateQuestionParams extends Path, Content {
    title: string;
    skills: string[];
    author: Schema.Types.ObjectId | IUser;
    isInstant?: boolean;
}

export interface GetQuestionByIdParams extends QuestionId {}

export interface QuestionVoteParams extends QuestionId, UserId, Path, Voting {}

export interface DeleteQuestionParams extends QuestionId, Path {
    isQuestionPath?: boolean;
}

export interface EditQuestionParams extends QuestionId, Path, Content {
    title: string;
    skills?: string[];
    mark: string;
}

/**
 * Interfaces for answer actions
 */
export interface CreateAnswerParams extends Path, Content {
    author: string;
    question: string;
}

export interface GetAnswersParams
    extends OptionalPage,
        OptionalPageSize,
        QuestionId {
    sortBy?: string;
}

export interface GetAnswerByIdParams extends AnswerId {}

export interface AnswerVoteParams extends AnswerId, UserId, Path, Voting {}

export interface DeleteAnswerParams extends Path, AnswerId {}

export interface EditAnswerParams extends Path, AnswerId, Content {}

/**
 * Interfaces for interaction actions
 */
export interface ViewQuestionParams extends UserId, QuestionId {}

/**
 * Interfaces for tag actions
 */
export interface GetTopInteractedTagsParams extends UserId {
    limit?: number;
}

export interface GetAllTagsParams extends Searchable {}

export interface GetQuestionByTagIdParams
    extends OptionalPage,
        OptionalPageSize,
        OptionalSearch {
    skillId: string;
}

export interface GetTagByIdParams {
    skillId: string;
}

/**
 *
 */
export interface SearchParams {
    query?: string | null;
    type?: string | null;
}

export interface RecommendedParams
    extends UserId,
        OptionalPage,
        OptionalPageSize,
        OptionalSearch {}

export interface JobFilterParams {
    query: string;
    page: string;
}

export interface GetFormattedSalaryParams {
    min: number;
    max: number;
    currency: string;
    period: string;
}

export interface SendNotificationParams {
    title: string;
    message: string;
    userId: string;
    templateType?: {
        Standard: string;
        SingleAction: string;
        MultiAction: string;
    };
    sender?: string;
    type?: string;
    path: string;
}

export interface CreateVideoCallParams{}

export interface UpdateVideoCallParams {
    updateData: Partial<IVideoCall>;
    callRoomId: string;
}
export interface VideoCallData extends IVideoCall {}