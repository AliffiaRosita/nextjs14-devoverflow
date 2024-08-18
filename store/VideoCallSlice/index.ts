import { StateCreator } from 'zustand';
import { VideoCallSlice } from './types';
import { InvitedMentors, KnockUser } from '@/types';
import { MongoUser } from '@/lib/actions/shared.types';

const initialState = {
    invitedMentors: [],
    knockUser: null,
    userAuthorId: null,
    callRoomId: null,
    questionId: null,
    mongoUser: null,
};

export const createVideoCallSlice: StateCreator<VideoCallSlice> = set => ({
    ...initialState,
    setInvitedMentors: (invitedMentors: InvitedMentors[]) =>
        set(() => ({ invitedMentors })),
    setKnockUser: (knockUser: KnockUser) => set(() => ({ knockUser })),
    setUserAuthorId: (userAuthorId: string) => set(() => ({ userAuthorId })),
    setCallRoomId: (callRoomId: string) => set(() => ({ callRoomId })),
    setQuestionId: (questionId: string) => set(() => ({ questionId })),
    setMongoUser: (mongoUser: MongoUser) => set(() => ({ mongoUser })),
    resetAuth: () => {
        set(initialState);
    },
});
