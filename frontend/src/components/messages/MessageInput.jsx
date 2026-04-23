import { useEffect, useRef, useState } from "react";
import { BsPaperclip, BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [attachment, setAttachment] = useState(null);
	const { loading, sendMessage } = useSendMessage();
	const { conversationInsights, selectedConversation } = useConversation();
	const { emitTypingStart, emitTypingStop } = useSocketContext();
	const fileInputRef = useRef(null);
	const typingTimeoutRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim() && !attachment) return;
		const sentMessage = await sendMessage({ message, file: attachment });
		if (!sentMessage) return;
		emitTypingStop(selectedConversation?._id);
		setMessage("");
		setAttachment(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);

	const handleMessageChange = (event) => {
		const nextMessage = event.target.value;
		setMessage(nextMessage);

		if (!selectedConversation?._id) {
			return;
		}

		if (!nextMessage.trim()) {
			emitTypingStop(selectedConversation._id);
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			return;
		}

		emitTypingStart(selectedConversation._id);
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		typingTimeoutRef.current = setTimeout(() => {
			emitTypingStop(selectedConversation._id);
		}, 1200);
	};

	const handleSuggestedReply = async (suggestedReply) => {
		const sentMessage = await sendMessage({ message: suggestedReply });
		if (!sentMessage) return;
		setMessage("");
		emitTypingStop(selectedConversation?._id);
	};

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			{conversationInsights?.smartReplies?.length ? (
				<div className='mb-3 flex flex-wrap gap-2'>
					{conversationInsights.smartReplies.map((reply) => (
						<button
							key={reply}
							className='rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 transition hover:border-sky-400 hover:text-white'
							onClick={() => handleSuggestedReply(reply)}
							type='button'
						>
							{reply}
						</button>
					))}
				</div>
			) : null}
			{attachment ? (
				<div className='mb-2 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-xs text-white/80'>
					<span>{attachment.name}</span>
					<button
						className='font-semibold text-red-300'
						onClick={() => {
							setAttachment(null);
							if (fileInputRef.current) {
								fileInputRef.current.value = "";
							}
						}}
						type='button'
					>
						Remove
					</button>
				</div>
			) : null}
			<div className='w-full relative'>
				<input
					accept='image/*,.pdf,.doc,.docx,.txt'
					className='hidden'
					onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
					ref={fileInputRef}
					type='file'
				/>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5 pr-20 bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onBlur={() => emitTypingStop(selectedConversation?._id)}
					onChange={handleMessageChange}
				/>
				<button
					className='absolute inset-y-0 end-10 flex items-center pe-3 text-white/70'
					onClick={() => fileInputRef.current?.click()}
					type='button'
				>
					<BsPaperclip />
				</button>
				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
					{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;
