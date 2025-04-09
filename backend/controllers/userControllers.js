import User from "../models/user.model.js";

export const getUsersForSideBar = async (req,res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({_id: loggedInUserId}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUserForSideBar", error.message);
        res.status(500).json({error:"Internal error at userController"});
        
    }
};