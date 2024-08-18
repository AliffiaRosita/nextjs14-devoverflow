import { Schema, models, model, Document } from 'mongoose';

export interface IVideoCall extends Document {
    callRoomId: string;
    invitedIds: string[];
    memberIds: string[];
    createdBy: string;
    createdAt: Date;
    questionId: string;
    type: string;
}

const VideoCallSchema = new Schema({
    callRoomId: { type: String, required: true },
    invitedIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    questionId: { type: String, required: true },
    type: { type: String, required: true },
});

const VideoCall = models.VideoCall || model('VideoCall', VideoCallSchema);

export default VideoCall;
