const POSITIVE_WORDS = ["great", "good", "awesome", "love", "nice", "perfect", "thanks", "thank you"];
const NEGATIVE_WORDS = ["bad", "sad", "angry", "late", "issue", "problem", "hate", "sorry"];

const buildFallbackReplies = (latestMessage = "") => {
	const normalizedMessage = latestMessage.toLowerCase();

	if (normalizedMessage.includes("?")) {
		return ["Sure, I can help with that.", "Yes, that works for me.", "Let me confirm and get back to you."];
	}

	if (normalizedMessage.includes("thank")) {
		return ["Happy to help.", "Anytime.", "You're welcome."];
	}

	if (normalizedMessage.includes("meeting") || normalizedMessage.includes("call")) {
		return ["That time works for me.", "Can we shift it by 15 minutes?", "I'll be there."];
	}

	return ["Sounds good.", "I'll take care of it.", "Let's do it."];
};

const buildFallbackInsights = (messages) => {
	const normalizedMessages = messages
		.map((message) => message.message?.toLowerCase() ?? "")
		.filter(Boolean);

	const positiveScore = normalizedMessages.reduce(
		(score, message) => score + POSITIVE_WORDS.filter((word) => message.includes(word)).length,
		0
	);
	const negativeScore = normalizedMessages.reduce(
		(score, message) => score + NEGATIVE_WORDS.filter((word) => message.includes(word)).length,
		0
	);
	const totalScore = positiveScore - negativeScore;
	const sentiment =
		totalScore > 0
			? { label: "positive", score: Math.min(1, totalScore / 5) }
			: totalScore < 0
				? { label: "negative", score: Math.max(-1, totalScore / 5) }
				: { label: "neutral", score: 0 };
	const latestMessage = messages.at(-1)?.message ?? "";

	return {
		sentiment,
		smartReplies: buildFallbackReplies(latestMessage),
	};
};

export const analyzeConversation = async (messages) => {
	if (!process.env.NLP_SERVICE_URL) {
		return buildFallbackInsights(messages);
	}

	try {
		const response = await fetch(`${process.env.NLP_SERVICE_URL.replace(/\/$/, "")}/analyze`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ messages }),
		});

		if (!response.ok) {
			throw new Error(`NLP service returned ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.warn("Falling back to local NLP heuristics:", error.message);
		return buildFallbackInsights(messages);
	}
};
