import { MongoUser } from '@/lib/actions/shared.types';
import { InvitedUsers, KnockUser } from '@/types';

export interface VideoCallSlice {
    invitedUsers: InvitedUsers[] | [];
    knockUser: KnockUser | null;
    userAuthorClerkId: string | null;
    callRoomId: string | null;
    questionId: string | null;
    mongoUser: MongoUser | null;
    setInvitedUsers: (invitedUsers: InvitedUsers[]) => void;
    setKnockUser: (knockUser: KnockUser) => void;
    setUserAuthorClerkId: (userAuthorClerkId: string) => void;
    setCallRoomId: (callRoomId: string) => void;
    setQuestionId: (questionId: string) => void;
    setMongoUser: (mongoUser: MongoUser) => void;
    resetAuth: () => void;
}
