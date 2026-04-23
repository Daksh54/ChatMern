import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<aside className='sidebar-panel p-5'>
			<div className='mb-5 flex items-start justify-between gap-4'>
				<div>
					<div className='mb-3 flex items-center gap-3'>
						<div className='brand-mark display-font'>P</div>
						<div>
							<p className='display-font text-2xl font-bold text-slate-900'>Pulse</p>
							<p className='text-sm text-slate-500'>Simple team messaging.</p>
						</div>
					</div>
					<div className='section-pill'>Chats</div>
				</div>
			</div>
			<SearchInput />
			<div className='my-5 h-px bg-white/8'></div>
			<Conversations />
			<LogoutButton />
		</aside>
	);
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;
