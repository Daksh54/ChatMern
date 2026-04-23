import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import { HiOutlineGlobeAlt, HiOutlineSparkles } from "react-icons/hi2";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className='auth-shell fade-up'>
			<section className='auth-showcase'>
				<p className='section-pill mb-6 w-fit'>
					<HiOutlineSparkles />
					Create account
				</p>
				<h1 className='display-font mb-4 max-w-xl text-5xl font-bold leading-tight text-slate-900'>
					Get started in a few simple steps.
				</h1>
				<p className='max-w-xl text-base leading-7 text-slate-500'>
					Set up your profile and start chatting right away.
				</p>
				<div className='mt-10 space-y-4'>
					<div className='auth-metric'>
						<div className='mb-3 flex items-center gap-2 text-sm text-slate-500'>
							<HiOutlineGlobeAlt />
							Ready to use
						</div>
						<p className='display-font text-2xl font-semibold text-slate-900'>Clean interface, live messaging</p>
						<p className='mt-2 text-sm text-slate-500'>A minimal setup with the features already in place.</p>
					</div>
				</div>
			</section>
			<section className='auth-panel'>
				<p className='section-pill mb-5 w-fit'>Create account</p>
				<h2 className='display-font mb-2 text-4xl font-bold text-slate-900'>Sign up</h2>
				<p className='mb-8 text-slate-500'>Fill in your details to create an account.</p>

				<form className='space-y-5' onSubmit={handleSubmit}>
					<div>
						<label className='mb-2 block text-sm uppercase tracking-[0.18em] text-slate-400'>Full Name</label>
						<input
							type='text'
							placeholder='John Doe'
							className='glass-input'
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
					</div>

					<div>
						<label className='mb-2 block text-sm uppercase tracking-[0.18em] text-slate-400'>Username</label>
						<input
							type='text'
							placeholder='johndoe'
							className='glass-input'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
					</div>

					<div>
						<label className='mb-2 block text-sm uppercase tracking-[0.18em] text-slate-400'>Password</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='glass-input'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
					</div>

					<div>
						<label className='mb-2 block text-sm uppercase tracking-[0.18em] text-slate-400'>Confirm Password</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='glass-input'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>

					<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

					<Link
						to={"/login"}
						className='inline-block text-sm text-slate-500 transition hover:text-blue-600'
						href='#'
					>
						Already have an account? Sign in
					</Link>

					<div className='pt-2'>
						<button className='primary-button w-full' disabled={loading}>
							{loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
};
export default SignUp;

// STARTER CODE FOR THE SIGNUP COMPONENT
// import GenderCheckbox from "./GenderCheckbox";

// const SignUp = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Sign Up <span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Full Name</span>
// 						</label>
// 						<input type='text' placeholder='John Doe' className='w-full input input-bordered  h-10' />
// 					</div>

// 					<div>
// 						<label className='label p-2 '>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='johndoe' className='w-full input input-bordered h-10' />
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

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Confirm Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Confirm Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>

// 					<GenderCheckbox />

// 					<a className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block' href='#'>
// 						Already have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2 border border-slate-700'>Sign Up</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default SignUp;
