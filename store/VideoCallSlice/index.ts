import { StateCreator } from 'zustand';
import { VideoCallSlice } from './types';
import { InvitedUsers, KnockUser } from '@/types';
import { MongoUser } from '@/lib/actions/shared.types';

const initialState = {
    invitedUsers: [],
    knockUser: null,
    userAuthorClerkId: null,
    callRoomId: null,
    questionId: null,
    mongoUser: null,
};

export const createVideoCallSlice: StateCreator<VideoCallSlice> = set => ({
    ...initialState,
    setInvitedUsers: (invitedUsers: InvitedUsers[]) =>
        set(() => ({ invitedUsers })),
    setKnockUser: (knockUser: KnockUser) => set(() => ({ knockUser })),
    setUserAuthorClerkId: (userAuthorClerkId: string) => set(() => ({ userAuthorClerkId })),
    setCallRoomId: (callRoomId: string) => set(() => ({ callRoomId })),
    setQuestionId: (questionId: string) => set(() => ({ questionId })),
    setMongoUser: (mongoUser: MongoUser) => set(() => ({ mongoUser })),
    resetAuth: () => {
        set(initialState);
    },
});
