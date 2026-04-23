import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { HiOutlineLockClosed, HiOutlineSparkles } from "react-icons/hi2";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className='auth-shell fade-up'>
			<section className='auth-showcase'>
				<p className='section-pill mb-6 w-fit'>
					<HiOutlineSparkles />
					Welcome
				</p>
				<h1 className='display-font mb-4 max-w-xl text-5xl font-bold leading-tight text-slate-900'>
					A cleaner place for team conversations.
				</h1>
				<p className='max-w-xl text-base leading-7 text-slate-500'>
					Simple messaging, live updates, and a calmer interface.
				</p>
				<div className='mt-10 grid gap-4'>
					<div className='auth-metric'>
						<div className='mb-3 flex items-center gap-2 text-sm text-slate-500'>
							<HiOutlineLockClosed />
							Secure access
						</div>
						<p className='display-font text-2xl font-semibold text-slate-900'>Fast, direct, and lightweight</p>
						<p className='mt-2 text-sm text-slate-500'>Everything you need to chat without extra clutter.</p>
					</div>
				</div>
			</section>
			<section className='auth-panel'>
				<p className='section-pill mb-5 w-fit'>Sign in</p>
				<h2 className='display-font mb-2 text-4xl font-bold text-slate-900'>Login</h2>
				<p className='mb-8 text-slate-500'>Enter your account details to continue.</p>

				<form className='space-y-5' onSubmit={handleSubmit}>
					<div>
						<label className='mb-2 block text-sm uppercase tracking-[0.18em] text-slate-400'>Username</label>
						<input
							type='text'
							placeholder='Enter username'
							className='glass-input'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<label className='mb-2 block text-sm uppercase tracking-[0.18em] text-slate-400'>Password</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='glass-input'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Link to='/signup' className='inline-block text-sm text-slate-500 transition hover:text-blue-600'>
						{"Don't"} have an account? Create one
					</Link>

					<div className='pt-2'>
						<button className='primary-button w-full' disabled={loading}>
							{loading ? <span className='loading loading-spinner '></span> : "Login"}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
};
export default Login;

// STARTER CODE FOR THIS FILE
// const Login = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Login
// 					<span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='Enter username' className='w-full input input-bordered h-10' />
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Enter Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>
// 					<a href='#' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
// 						{"Don't"} have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2'>Login</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default Login;
