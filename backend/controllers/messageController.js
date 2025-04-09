import Conversation from "../models/conversation.model.js";

export const  sendMessages = async(req, res)=>{
    try {
        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req._id;

        const conversation = await Conversation.findOne({
            participants:{
                $all: [senderId, receiverId]
            },
        })

        if(!conversation){
            conversation = await Conversatio.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if(!newMessage){
            conversation.messages.push(newMessage._id);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("error in sendMessage controller: ", error.message);
        res.send(500).json({error:"internal server error"});
    }
}; 

export default sendMessages;