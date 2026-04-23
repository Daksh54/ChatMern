import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	return (
		<div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
			<div className='mb-4 flex items-end justify-between gap-3'>
				<div>
					<p className='display-font text-lg font-semibold text-slate-900'>Messages</p>
					<p className='text-sm text-slate-500'>{conversations.length} conversations</p>
				</div>
			</div>
			<div className='flex flex-1 flex-col gap-3 overflow-auto pr-1'>
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

				{loading ? <span className='loading loading-spinner mx-auto mt-4'></span> : null}
			</div>
		</div>
	);
};
export default Conversations;

// STARTER CODE SNIPPET
// import Conversation from "./Conversation";

// const Conversations = () => {
// 	return (
// 		<div className='py-2 flex flex-col overflow-auto'>
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 		</div>
// 	);
// };
// export default Conversations;
