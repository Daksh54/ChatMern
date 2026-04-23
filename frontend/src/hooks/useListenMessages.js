import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { appendMessage, selectedConversation, updateMessages } = useConversation();

	useEffect(() => {
		if (!socket) {
			return undefined;
		}

		const handleNewMessage = (newMessage) => {
			const sound = new Audio(notificationSound);
			sound.play();
			appendMessage({
				...newMessage,
				shouldShake: selectedConversation?._id !== newMessage.senderId,
			});
		};

		const handleMessagesDelivered = ({ messageIds, deliveredAt }) => {
			updateMessages(messageIds, { deliveredAt });
		};

		const handleMessagesRead = ({ messageIds, readAt }) => {
			updateMessages(messageIds, { readAt, deliveredAt: readAt });
		};

		socket.on("newMessage", handleNewMessage);
		socket.on("messagesDelivered", handleMessagesDelivered);
		socket.on("messagesRead", handleMessagesRead);

		return () => {
			socket.off("newMessage", handleNewMessage);
			socket.off("messagesDelivered", handleMessagesDelivered);
			socket.off("messagesRead", handleMessagesRead);
		};
	}, [socket, appendMessage, updateMessages, selectedConversation?._id]);
};
export default useListenMessages;
