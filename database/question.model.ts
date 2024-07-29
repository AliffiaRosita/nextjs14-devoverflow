import { Schema, models, model, Document } from "mongoose";

export interface IQuestion extends Document {
	title: string;
	content: string;
	skills: Schema.Types.ObjectId[];
	views: number;
	shares: number;
	upvotes: Schema.Types.ObjectId[];
	downvotes: Schema.Types.ObjectId[];
	author: Schema.Types.ObjectId;
	answers: Schema.Types.ObjectId[];
	createdAt: Date;
	mark: string;
	isInstant: boolean,
}

const QuestionSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
	views: { type: Number, default: 0 },
	shares: { type: Number, default: 0 },
	upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	author: { type: Schema.Types.ObjectId, ref: "User" },
	answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
	createdAt: { type: Date, default: Date.now },
	mark: { type: String, default: "unsolved" },
	isInstant:  { type: Boolean, default: false },
});

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
