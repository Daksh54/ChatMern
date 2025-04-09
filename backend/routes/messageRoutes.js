import express from 'express';
import { sendMessages } from '../controllers/messageController.js';
import protectRoute from '../middleware/protectRoute.js';
import {getMessages} from '../controllers/messageController.js';

const router = express.Router();

router.get("/:id", protectRoute,  getMessages);
router.post("/send/:id", protectRoute,  sendMessages);

export default router;