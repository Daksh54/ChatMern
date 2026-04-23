import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<div className='mt-5 pt-4'>
			{!loading ? (
				<button className='secondary-button w-full justify-between px-4' onClick={logout} type='button'>
					<span>Logout</span>
					<BiLogOut className='h-5 w-5' />
				</button>
			) : (
				<span className='loading loading-spinner'></span>
			)}
		</div>
	);
};
export default LogoutButton;
