import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const senderId = typeof message.senderId === "object" ? message.senderId._id : message.senderId;
	const fromMe = senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const statusText = message.readAt
		? `Read ${extractTime(message.readAt)}`
		: message.deliveredAt
			? "Delivered"
			: "Sent";

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`mb-5 flex ${fromMe ? "justify-end" : "justify-start"}`}>
			<div className={`flex max-w-[90%] items-end gap-3 ${fromMe ? "flex-row-reverse" : ""}`}>
				<div className='w-10 shrink-0 overflow-hidden rounded-2xl border border-white/10'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
				<div className={`min-w-0 ${fromMe ? "items-end" : "items-start"} flex flex-col`}>
					<div className={`message-bubble ${fromMe ? "message-bubble-me" : "message-bubble-them"} ${shakeClass}`}>
						{message.message ? <p className='whitespace-pre-wrap leading-6'>{message.message}</p> : null}
						{message.attachment?.kind === "image" ? (
							<a href={message.attachment.url} rel='noreferrer' target='_blank'>
								<img
									alt={message.attachment.name}
									className='mt-3 max-w-xs rounded-2xl border border-white/20'
									src={message.attachment.url}
								/>
							</a>
						) : null}
						{message.attachment?.kind === "file" ? (
							<a
								className={`mt-3 inline-flex rounded-2xl border px-3 py-2 text-sm ${fromMe ? "border-black/10 bg-black/10" : "border-white/10 bg-white/5"}`}
								href={message.attachment.url}
								rel='noreferrer'
								target='_blank'
							>
								{message.attachment.name}
							</a>
						) : null}
					</div>
					<div className='mt-2 flex items-center gap-2 px-1 text-xs text-slate-400'>
						<span>{formattedTime}</span>
						{fromMe ? <span>• {statusText}</span> : null}
					</div>
				</div>
			</div>
		</div>
	);
};
export default Message;
