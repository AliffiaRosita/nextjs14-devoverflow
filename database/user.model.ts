import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
	clerkId: string;
	firebaseId: string;
	googleId: string;
	emailOTP: number;
	isEmailVerified: boolean;
	name: string;
	username: string;
	email: string;
	password?: string;
	bio?: string;
	picture: string;
	location?: string;
	whatsapp?: string;
	googleMeet?: string;
	zoom?: string;
	skype?: string;
	teams?: string;
	portfolioWebsite?: string;
	reputation?: number;
	saved: Schema.Types.ObjectId[];
	onboarded: boolean;
	streamToken?: string;
	skills: Schema.Types.ObjectId[];
    referredBy?: Schema.Types.ObjectId;
    referredTo?: Schema.Types.ObjectId[];
	joinedAt: Date;
}

const UserSchema = new Schema({
	clerkId: { type: String },
	firebaseId: { type: String },
	googleId: { type: String },
	OTPCode: { type: Number },
	isEmailVerified: { type: Boolean, default: false },
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String },
	bio: { type: String },
	picture: { type: String },
	location: { type: String },
	whatsapp: { type: String },
	googleMeet: { type: String },
	zoom: { type: String },
	skype: { type: String },
	teams: { type: String },
	portfolioWebsite: { type: String },
	reputation: { type: Number, default: 0 },
	saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
	onboarded: { type: Boolean, default: false },
	streamToken: { type: String },
	skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    referredBy: { type: Schema.Types.ObjectId, ref: "User" },
    referredTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
	joinedAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);

export default User;
