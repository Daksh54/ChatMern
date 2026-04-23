import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: true,
		},
		key: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		mimeType: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			required: true,
		},
		kind: {
			type: String,
			enum: ["image", "file"],
			required: true,
		},
	},
	{ _id: false }
);

const messageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
			index: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			default: "",
			trim: true,
			maxlength: 2000,
		},
		attachment: {
			type: attachmentSchema,
			default: null,
		},
		deliveredAt: {
			type: Date,
			default: null,
		},
		readAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

messageSchema.pre("validate", function validateMessageContent(next) {
	if (!this.message && !this.attachment) {
		this.invalidate("message", "Message text or attachment is required");
	}

	next();
});

messageSchema.index({ conversationId: 1, _id: -1 });
messageSchema.index({ receiverId: 1, deliveredAt: 1 });
messageSchema.index({ receiverId: 1, readAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
