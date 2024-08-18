'use server';

import VideoCall from '@/database/videoCall.model';

import { connectToDatabase } from '@/lib/mongoose';

import type {
    CreateVideoCallParams,
    UpdateVideoCallParams,
} from './shared.types';

export async function createVideoCall(videoCallData: CreateVideoCallParams) {
    try {
        connectToDatabase();

        const newVideoCall = await VideoCall.create(videoCallData);

        return JSON.parse(JSON.stringify(newVideoCall));
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateVideoCall(params: UpdateVideoCallParams) {
    try {
        connectToDatabase();

        const { callRoomId, updateData } = params;

        await VideoCall.findOneAndUpdate(
            { callRoomId },
            {
                $set: { ...updateData },
            },
            {
                new: true,
            },
        );
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getVideoCallByRoomId(params: {
    callRoomId: string | null;
}) {
    try {
        connectToDatabase();

        const { callRoomId } = params;

        const videoCall = await VideoCall.findOne({
            callRoomId,
        });

        return JSON.parse(JSON.stringify(videoCall));
    } catch (error) {
        console.log(error);
        throw error;
    }
}
