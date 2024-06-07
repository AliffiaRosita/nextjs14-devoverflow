import { Schema, models, model, Document } from "mongoose";

export interface IInteraction extends Document {
    user: Schema.Types.ObjectId;
    action: string;
    question: Schema.Types.ObjectId;
    answer: Schema.Types.ObjectId;
    skills: Schema.Types.ObjectId[];
    createdAt: Date;
}

const InteractionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question" },
    answer: { type: Schema.Types.ObjectId, ref: "Answer" },
    skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    createdAt: { type: Date, default: Date.now },
});

const Interaction =
    models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;
