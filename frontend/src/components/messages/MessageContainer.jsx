import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import useConversationInsights from "../../hooks/useConversationInsights";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { isUserTyping, onlineUsers } = useSocketContext();
	const { conversationInsights, loading: loadingInsights } = useConversationInsights();
	const sentimentLabel = conversationInsights?.sentiment?.label ?? "neutral";
	const sentimentScore = conversationInsights?.sentiment?.score ?? 0;

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<section className='chat-panel min-w-0'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					<div className='border-b border-slate-200 px-5 py-4'>
						<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
							<div className='flex items-center gap-4'>
								<div className='w-12 overflow-hidden rounded-2xl border border-slate-200'>
									<img alt={selectedConversation.fullName} src={selectedConversation.profilePic} />
								</div>
								<div>
									<div className='mb-1 flex items-center gap-3'>
										<p className='display-font text-2xl font-bold text-slate-900'>{selectedConversation.fullName}</p>
										<span className='section-pill'>
											<span
												className={`status-dot ${onlineUsers.includes(selectedConversation._id) ? "status-online" : "status-offline"}`}
											></span>
											{onlineUsers.includes(selectedConversation._id) ? "Online" : "Offline"}
										</span>
									</div>
									<p className='text-sm text-slate-500'>
										{isUserTyping(selectedConversation._id) ? "Typing..." : "Direct message"}
									</p>
								</div>
							</div>
							<div className='signal-card min-w-[180px]'>
								<div className='text-xs uppercase tracking-[0.18em] text-slate-400'>Sentiment</div>
								<div className='mt-1 display-font text-lg font-semibold capitalize text-slate-900'>
									{loadingInsights ? "Analyzing" : sentimentLabel}
								</div>
								<div className='text-sm text-slate-500'>{loadingInsights ? "Please wait" : `Score ${sentimentScore}`}</div>
							</div>
						</div>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</section>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex h-full items-center justify-center p-8'>
			<div className='mx-auto max-w-2xl text-center'>
				<div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] border border-slate-200 bg-white'>
					<TiMessages className='text-4xl text-[#2563eb]' />
				</div>
				<p className='section-pill mx-auto mb-5 w-fit'>Ready</p>
				<h1 className='display-font mb-4 text-4xl font-bold text-slate-900 md:text-5xl'>
					Welcome back, {authUser.fullName}
				</h1>
				<p className='mx-auto max-w-xl text-base leading-7 text-slate-500 md:text-lg'>
					Choose a conversation from the left to start chatting.
				</p>
			</div>
		</div>
	);
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
