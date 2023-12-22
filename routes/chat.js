import { Router } from "express";
import { createChat, getChats } from "../controller/chat.js";
import { authenticate } from "../middleware/authMiddleware.js";
import chatValidator from "../middleware/validators/chat/chat.js"
import { createMessage, deleteMessage, getMessages, updateMessage } from "../controller/messages.js";

const router = Router()

router.route('/')
    .get(authenticate, getChats)
    .post(authenticate, chatValidator.createChat, createChat)

router.route('/:id/messages')
    .get(authenticate, getMessages)
    .post(authenticate, chatValidator.createMessage, createMessage)

router.route('/:id/messages/:msgId')
    .put(authenticate, chatValidator.createMessage, updateMessage)
    .delete(authenticate, deleteMessage)

export default router