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
		<div className='px-4 flex-1 overflow-auto' onScroll={handleScroll} ref={containerRef}>
			{loadingMore ? <div className='py-2 text-center text-xs opacity-70'>Loading older messages...</div> : null}
			{!loading &&
				messages.length > 0 &&
				messages.map((message, index) => (
					<div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
						<Message message={message} />
					</div>
				))}

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!loading && messages.length === 0 && (
				<p className='text-center'>Send a message to start the conversation</p>
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
