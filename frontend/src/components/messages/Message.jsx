import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const senderId = typeof message.senderId === "object" ? message.senderId._id : message.senderId;
	const fromMe = senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
	const statusText = message.readAt
		? `Read ${extractTime(message.readAt)}`
		: message.deliveredAt
			? "Delivered"
			: "Sent";

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
				{message.message ? <p className='whitespace-pre-wrap'>{message.message}</p> : null}
				{message.attachment?.kind === "image" ? (
					<a href={message.attachment.url} rel='noreferrer' target='_blank'>
						<img
							alt={message.attachment.name}
							className='mt-2 max-w-xs rounded-lg border border-white/20'
							src={message.attachment.url}
						/>
					</a>
				) : null}
				{message.attachment?.kind === "file" ? (
					<a
						className='mt-2 inline-flex rounded-md bg-black/20 px-3 py-2 text-sm underline'
						href={message.attachment.url}
						rel='noreferrer'
						target='_blank'
					>
						{message.attachment.name}
					</a>
				) : null}
			</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
				{formattedTime}
				{fromMe ? <span>• {statusText}</span> : null}
			</div>
		</div>
	);
};
export default Message;
