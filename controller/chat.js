import asyncHandler from 'express-async-handler'
import Chat from '../model/Chat.js'

// @route    GET api/v1/chat/:id
// @desc     Fetch a Chat
// @access   private
const getChat = asyncHandler(async (req, res) => {
    const { params } = req

    const chat = await Chat.findById(params.id)

    if (!chat) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("chat") }));
    }

    res.status(200).json(chat)
})

// @route    GET api/v1/chat/:id
// @desc     Fetch All Chats
// @access   public
const getChats = asyncHandler(async (req, res) => {
    const chats = await Chat
        .find({ users: { $elemMatch: { $eq: req.user.id } } })
        .populate({
            path: "users", select: "firstName lastName image",
            options: { skip: 1 }
        });

    res.status(200).json(chats)
})

// @route    POST api/v1/chat
// @desc     Create Chat
// @access   private
const createChat = asyncHandler(async (req, res) => {
    const { user, body } = req

    body.users = [user.id, body.reciver]
    body.messages = [{ sender: user.id, content: body.content }]

    const isChatExist = await Chat.find({
        $and: [
            { users: { $in: [user.id, body.reciver] } },
        ]
    });

    if (isChatExist.length > 0) {
        return res.status(200).json("seccess")
    }

    const chat = await Chat.create(body)
    await chat.populate("users", "firstName lastName image")
    await chat.populate("messages.sender", "firstName lastName image")

    if (!chat) {
        res.status(500);
        throw new Error(req.t("something-went-wrong"));
    }

    // chat.messages.pop()
    res.status(200).json(chat)
})

export {
    getChat,
    getChats,
    createChat,
}