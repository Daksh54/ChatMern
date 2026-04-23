import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		participantKey: {
			type: String,
			trim: true,
		},
		lastMessageAt: {
			type: Date,
			default: null,
		},
		lastMessagePreview: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

conversationSchema.index({ participantKey: 1 }, { unique: true, sparse: true });
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
