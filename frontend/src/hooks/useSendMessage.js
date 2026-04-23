import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { apiFetch } from "../utils/api";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { appendMessage, selectedConversation } = useConversation();

	const uploadAttachment = async (file) => {
		const presignResponse = await apiFetch("/api/messages/attachments/presign", {
			method: "POST",
			body: JSON.stringify({
				fileName: file.name,
				fileType: file.type || "application/octet-stream",
				fileSize: file.size,
			}),
		});
		const presignPayload = await presignResponse.json();
		if (presignPayload.error) {
			throw new Error(presignPayload.error);
		}

		const uploadResponse = await fetch(presignPayload.uploadUrl, {
			method: "PUT",
			headers: {
				"Content-Type": file.type || "application/octet-stream",
			},
			body: file,
		});

		if (!uploadResponse.ok) {
			throw new Error("Attachment upload failed");
		}

		return presignPayload.attachment;
	};

	const sendMessage = async ({ message, file = null }) => {
		setLoading(true);
		try {
			const attachment = file ? await uploadAttachment(file) : null;
			const res = await apiFetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				body: JSON.stringify({ message, attachment }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			appendMessage(data);
			return data;
		} catch (error) {
			toast.error(error.message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
