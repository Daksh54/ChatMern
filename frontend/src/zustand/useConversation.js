import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) =>
		set({
			selectedConversation,
			messages: [],
			pagination: {
				hasMore: false,
				nextCursor: null,
			},
			conversationInsights: null,
		}),
	messages: [],
	setMessages: (messages) => set({ messages }),
	appendMessage: (message) =>
		set((state) => {
			if (state.messages.some((currentMessage) => currentMessage._id === message._id)) {
				return state;
			}

			return { messages: [...state.messages, message] };
		}),
	prependMessages: (messages) =>
		set((state) => ({
			messages: [...messages, ...state.messages],
		})),
	updateMessages: (messageIds, updates) =>
		set((state) => ({
			messages: state.messages.map((message) =>
				messageIds.includes(message._id) ? { ...message, ...updates } : message
			),
		})),
	pagination: {
		hasMore: false,
		nextCursor: null,
	},
	setPagination: (pagination) =>
		set((state) => ({
			pagination: {
				...state.pagination,
				...pagination,
			},
		})),
	conversationInsights: null,
	setConversationInsights: (conversationInsights) => set({ conversationInsights }),
}));

export default useConversation;
