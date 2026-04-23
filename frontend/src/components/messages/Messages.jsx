import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";
import { apiFetch } from "../../utils/api";

const Messages = () => {
	const { hasMore, loadOlderMessages, loading, loadingMore, messages } = useGetMessages();
	const { selectedConversation } = useConversation();
	useListenMessages();
	const lastMessageRef = useRef();
	const containerRef = useRef();
	const previousScrollHeightRef = useRef(null);

	useEffect(() => {
		if (previousScrollHeightRef.current && containerRef.current) {
			const currentContainer = containerRef.current;
			const nextScrollTop = currentContainer.scrollHeight - previousScrollHeightRef.current;
			currentContainer.scrollTop = nextScrollTop;
			previousScrollHeightRef.current = null;
			return;
		}

		const timeoutId = setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);

		return () => clearTimeout(timeoutId);
	}, [messages]);

	useEffect(() => {
		const markMessagesRead = async () => {
			const hasUnreadMessages = messages.some(
				(message) => message.senderId === selectedConversation?._id && !message.readAt
			);

			if (!selectedConversation?._id || !hasUnreadMessages) {
				return;
			}

			await apiFetch(`/api/messages/${selectedConversation._id}/read`, {
				method: "POST",
			});
		};

		markMessagesRead();
	}, [messages, selectedConversation?._id]);

	const handleScroll = async (event) => {
		if (event.currentTarget.scrollTop > 60 || !hasMore || loadingMore) {
			return;
		}

		previousScrollHeightRef.current = event.currentTarget.scrollHeight;
		await loadOlderMessages();
	};

	return (
		<div className='chat-scroll flex-1 overflow-auto px-5 py-5' onScroll={handleScroll} ref={containerRef}>
			{loadingMore ? (
				<div className='mb-4 text-center text-xs uppercase tracking-[0.18em] text-slate-400'>
					Loading messages...
				</div>
			) : null}
			{!loading &&
				messages.length > 0 &&
				messages.map((message, index) => (
					<div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
						<Message message={message} />
					</div>
				))}

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!loading && messages.length === 0 && (
				<div className='flex h-full min-h-[280px] items-center justify-center'>
					<div className='text-center'>
						<p className='display-font mb-2 text-2xl font-semibold text-slate-900'>No messages yet</p>
						<p className='text-slate-500'>Send the first message to begin.</p>
					</div>
				</div>
			)}
		</div>
	);
};
export default Messages;

// STARTER CODE SNIPPET
// import Message from "./Message";

// const Messages = () => {
// 	return (
// 		<div className='px-4 flex-1 overflow-auto'>
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 		</div>
// 	);
// };
// export default Messages;
