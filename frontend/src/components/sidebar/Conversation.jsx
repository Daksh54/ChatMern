import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);

	return (
		<>
			<div
				className={`conversation-tile cursor-pointer ${isSelected ? "conversation-active" : ""}`}
				onClick={() => setSelectedConversation(conversation)}
			>
				<div className='relative shrink-0'>
					<div className='w-14 overflow-hidden rounded-2xl border border-white/10'>
						<img src={conversation.profilePic} alt='user avatar' />
					</div>
					<span
						className={`absolute bottom-0 right-0 status-dot ${isOnline ? "status-online" : "status-offline"}`}
					></span>
				</div>

				<div className='min-w-0 flex-1'>
					<div className='mb-1 flex items-center justify-between gap-3'>
						<p className='truncate font-semibold text-slate-900'>{conversation.fullName}</p>
						<span className='rounded-full bg-slate-100 px-2 py-1 text-sm'>{emoji}</span>
					</div>
					<p className='truncate text-sm text-slate-500'>{isOnline ? "Online" : "Offline"}</p>
				</div>
			</div>

			{!lastIdx && <div className='h-0.5'></div>}
		</>
	);
};
export default Conversation;

// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;
