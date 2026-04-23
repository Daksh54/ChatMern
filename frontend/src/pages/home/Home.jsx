import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className='app-shell fade-up'>
			<Sidebar />
			<MessageContainer />
		</div>
	);
};
export default Home;
