import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
	const { authUser } = useAuthContext();
	return (
		<div className='portal-root'>
			<div className='page-frame'>
				<Routes>
					<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
					<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
					<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
				</Routes>
			</div>
			<Toaster
				position='top-center'
				toastOptions={{
					style: {
						borderRadius: "14px",
						background: "rgba(255,255,255,0.95)",
						color: "#122033",
						border: "1px solid rgba(15,23,42,0.08)",
						backdropFilter: "blur(10px)",
					},
				}}
			/>
		</div>
	);
}

export default App;
