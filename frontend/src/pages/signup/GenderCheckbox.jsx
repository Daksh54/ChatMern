const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
	return (
		<div>
			<p className='mb-3 text-sm uppercase tracking-[0.18em] text-slate-400'>Gender</p>
			<div className='grid gap-3 sm:grid-cols-2'>
				<label
					className={`cursor-pointer rounded-2xl border p-4 transition ${
						selectedGender === "male"
							? "border-blue-300 bg-blue-50"
							: "border-slate-200 bg-white"
					}`}
				>
					<div className='mb-2 flex items-center justify-between'>
						<span className='display-font text-lg font-semibold text-slate-900'>Male</span>
						<input
							type='checkbox'
							className='checkbox border-slate-300 bg-transparent [--chkbg:#2563eb] [--chkfg:#ffffff]'
							checked={selectedGender === "male"}
							onChange={() => onCheckboxChange("male")}
						/>
					</div>
					<p className='text-sm text-slate-500'>Use the default male avatar.</p>
				</label>
				<label
					className={`cursor-pointer rounded-2xl border p-4 transition ${
						selectedGender === "female"
							? "border-blue-300 bg-blue-50"
							: "border-slate-200 bg-white"
					}`}
				>
					<div className='mb-2 flex items-center justify-between'>
						<span className='display-font text-lg font-semibold text-slate-900'>Female</span>
						<input
							type='checkbox'
							className='checkbox border-slate-300 bg-transparent [--chkbg:#2563eb] [--chkfg:#ffffff]'
							checked={selectedGender === "female"}
							onChange={() => onCheckboxChange("female")}
						/>
					</div>
					<p className='text-sm text-slate-500'>Use the default female avatar.</p>
				</label>
			</div>
		</div>
	);
};
export default GenderCheckbox;

// STARTER CODE FOR THIS FILE
// const GenderCheckbox = () => {
// 	return (
// 		<div className='flex'>
// 			<div className='form-control'>
// 				<label className={`label gap-2 cursor-pointer`}>
// 					<span className='label-text'>Male</span>
// 					<input type='checkbox' className='checkbox border-slate-900' />
// 				</label>
// 			</div>
// 			<div className='form-control'>
// 				<label className={`label gap-2 cursor-pointer`}>
// 					<span className='label-text'>Female</span>
// 					<input type='checkbox' className='checkbox border-slate-900' />
// 				</label>
// 			</div>
// 		</div>
// 	);
// };
// export default GenderCheckbox;
