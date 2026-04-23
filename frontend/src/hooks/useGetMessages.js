import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { apiFetch } from "../utils/api";

const PAGE_SIZE = 20;

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const { messages, pagination, prependMessages, selectedConversation, setMessages, setPagination } =
		useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await apiFetch(`/api/messages/${selectedConversation._id}?limit=${PAGE_SIZE}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setMessages(data.messages);
				setPagination({
					hasMore: data.hasMore,
					nextCursor: data.nextCursor,
				});
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (!selectedConversation?._id) {
			setMessages([]);
			setPagination({
				hasMore: false,
				nextCursor: null,
			});
			return;
		}

		getMessages();
	}, [selectedConversation?._id, setMessages, setPagination]);

	const loadOlderMessages = async () => {
		if (!selectedConversation?._id || !pagination.hasMore || !pagination.nextCursor || loadingMore) {
			return;
		}

		setLoadingMore(true);
		try {
			const res = await apiFetch(
				`/api/messages/${selectedConversation._id}?limit=${PAGE_SIZE}&cursor=${pagination.nextCursor}`
			);
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			prependMessages(data.messages);
			setPagination({
				hasMore: data.hasMore,
				nextCursor: data.nextCursor,
			});
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoadingMore(false);
		}
	};

	return { messages, loading, loadingMore, hasMore: pagination.hasMore, loadOlderMessages };
};
export default useGetMessages;
