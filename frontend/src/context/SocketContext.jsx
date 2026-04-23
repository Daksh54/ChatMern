import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { getSocketUrl } from "../utils/api";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [typingUsers, setTypingUsers] = useState({});
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socketInstance = io(getSocketUrl(), {
				withCredentials: true,
				auth: {
					userId: authUser._id,
				},
			});

			setSocket(socketInstance);

			socketInstance.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			socketInstance.on("typing:start", ({ from }) => {
				setTypingUsers((currentTypingUsers) => ({
					...currentTypingUsers,
					[from]: true,
				}));
			});

			socketInstance.on("typing:stop", ({ from }) => {
				setTypingUsers((currentTypingUsers) => {
					const nextTypingUsers = { ...currentTypingUsers };
					delete nextTypingUsers[from];
					return nextTypingUsers;
				});
			});

			return () => {
				socketInstance.off("getOnlineUsers");
				socketInstance.off("typing:start");
				socketInstance.off("typing:stop");
				socketInstance.close();
				setTypingUsers({});
			};
		} else {
			setSocket(null);
			setTypingUsers({});
		}
	}, [authUser]);

	const emitTypingStart = (recipientId) => {
		if (recipientId) {
			socket?.emit("typing:start", { to: recipientId });
		}
	};

	const emitTypingStop = (recipientId) => {
		if (recipientId) {
			socket?.emit("typing:stop", { to: recipientId });
		}
	};

	return (
		<SocketContext.Provider
			value={{
				socket,
				onlineUsers,
				isUserTyping: (userId) => Boolean(typingUsers[userId]),
				emitTypingStart,
				emitTypingStop,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};
