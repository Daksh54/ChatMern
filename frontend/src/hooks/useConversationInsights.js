import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useConversation from "../zustand/useConversation";
import { apiFetch } from "../utils/api";

const useConversationInsights = () => {
	const [loading, setLoading] = useState(false);
	const { conversationInsights, messages, selectedConversation, setConversationInsights } = useConversation();

	useEffect(() => {
		if (!selectedConversation?._id) {
			setConversationInsights(null);
			return;
		}

		const timeoutId = setTimeout(async () => {
			setLoading(true);
			try {
				const res = await apiFetch(`/api/messages/${selectedConversation._id}/insights`);
				const data = await res.json();

				if (data.error) {
					throw new Error(data.error);
				}

				setConversationInsights(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		}, 350);

		return () => clearTimeout(timeoutId);
	}, [selectedConversation?._id, messages.length, setConversationInsights]);

	return { conversationInsights, loading };
};

export default useConversationInsights;
