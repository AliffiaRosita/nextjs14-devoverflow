import { Document, model, models, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
    firebaseId: string;
    refreshToken: string;
}

const RefreshTokenSchema = new Schema({
    firebaseId: { type: String, required: true },
    refreshToken: { type: String, required: true },
});

const RefreshToken =
    models.RefreshToken || model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
