import express from 'express';
import { sendMessages } from '../controllers/messageController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post("/send/:id", protectRoute,  sendMessages)

export default router;