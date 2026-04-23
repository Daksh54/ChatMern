import Message from "../models/message.model.js";

const groupNotifications = (messages, timestampKey, timestampValue) => {
	return messages.reduce((accumulator, message) => {
		const groupKey = `${message.senderId}:${message.conversationId}`;

		if (!accumulator[groupKey]) {
			accumulator[groupKey] = {
				conversationId: message.conversationId.toString(),
				senderId: message.senderId.toString(),
				messageIds: [],
				[timestampKey]: timestampValue,
			};
		}

		accumulator[groupKey].messageIds.push(message._id.toString());
		return accumulator;
	}, {});
};

export const markMessagesDeliveredForUser = async (receiverId) => {
	const pendingMessages = await Message.find({
		receiverId,
		deliveredAt: null,
	})
		.select("_id senderId conversationId")
		.lean();

	if (pendingMessages.length === 0) {
		return [];
	}

	const deliveredAt = new Date();
	await Message.updateMany(
		{ _id: { $in: pendingMessages.map((message) => message._id) } },
		{ $set: { deliveredAt } }
	);

	return Object.values(groupNotifications(pendingMessages, "deliveredAt", deliveredAt));
};

export const markConversationMessagesAsRead = async ({ conversationId, readerId, otherUserId }) => {
	const unreadMessages = await Message.find({
		conversationId,
		receiverId: readerId,
		senderId: otherUserId,
		readAt: null,
	})
		.select("_id senderId conversationId")
		.lean();

	if (unreadMessages.length === 0) {
		return {
			conversationId: conversationId.toString(),
			messageIds: [],
			readAt: null,
			senderIds: [],
		};
	}

	const readAt = new Date();
	await Message.updateMany(
		{ _id: { $in: unreadMessages.map((message) => message._id) } },
		{ $set: { deliveredAt: readAt, readAt } }
	);

	return {
		conversationId: conversationId.toString(),
		messageIds: unreadMessages.map((message) => message._id.toString()),
		readAt,
		senderIds: [...new Set(unreadMessages.map((message) => message.senderId.toString()))],
	};
};
