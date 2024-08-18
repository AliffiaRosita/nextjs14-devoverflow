import { MongoUser } from '@/lib/actions/shared.types';
import { InvitedMentors, KnockUser } from '@/types';

export interface VideoCallSlice {
    invitedMentors: InvitedMentors[] | [];
    knockUser: KnockUser | null;
    userAuthorId: string | null;
    callRoomId: string | null;
    questionId: string | null;
    mongoUser: MongoUser | null;
    setInvitedMentors: (invitedMentors: InvitedMentors[]) => void;
    setKnockUser: (knockUser: KnockUser) => void;
    setUserAuthorId: (userAuthorId: string) => void;
    setCallRoomId: (callRoomId: string) => void;
    setQuestionId: (questionId: string) => void;
    setMongoUser: (mongoUser: MongoUser) => void;
    resetAuth: () => void;
}
