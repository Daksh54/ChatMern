import Conversation from "../models/conversation.model.js";

export const buildParticipantKey = (...participantIds) =>
	participantIds
		.map((participantId) => participantId.toString())
		.sort()
		.join(":");

export const findConversationBetweenUsers = async (userIdA, userIdB) => {
	const participantKey = buildParticipantKey(userIdA, userIdB);
	let conversation = await Conversation.findOne({ participantKey });

	if (!conversation) {
		conversation = await Conversation.findOne({
			participants: { $all: [userIdA, userIdB] },
		});

		if (conversation && conversation.participantKey !== participantKey) {
			conversation.participantKey = participantKey;
			await conversation.save();
		}
	}

	return conversation;
};

export const findOrCreateConversation = async (userIdA, userIdB) => {
	const participantKey = buildParticipantKey(userIdA, userIdB);
	let conversation = await findConversationBetweenUsers(userIdA, userIdB);

	if (!conversation) {
		conversation = await Conversation.create({
			participants: [userIdA, userIdB],
			participantKey,
		});
	}

	return conversation;
};
