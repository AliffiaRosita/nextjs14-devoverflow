import { create } from 'zustand';
import { createVideoCallSlice } from './VideoCallSlice';
import { VideoCallSlice } from './VideoCallSlice/types';

export const useBoundStore = create<VideoCallSlice>()((...a) => ({
    ...createVideoCallSlice(...a),
}));
