import asyncHandler from 'express-async-handler'
import Chat from '../model/Chat.js'

// @route    GET api/v1/chat/:id/messages
// @desc     Fetch All Chats
// @access   public
const getMessages = asyncHandler(async (req, res) => {
    const { params } = req

    const chats = await Chat.findById(params.id)
        .populate("messages.sender", "firstName lastName image")
        .lean()

    if (!chats) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("chat") }));
    }

    res.status(200).json(chats.messages)
})

// @route    POST api/v1/chat/:id/messages
// @desc     Create Chat
// @access   private
const createMessage = asyncHandler(async (req, res) => {
    const { params, user, body } = req

    const chats = await Chat.findOneAndUpdate(
        { _id: params.id },
        {
            $push: {
                messages: {
                    sender: user?.id,
                    content: body?.content
                },
            },
        },
        { new: true },
    )
        .populate("messages.sender", "firstName lastName image")

    if (!chats) {
        res.status(500);
        throw new Error(req.t("something-went-wrong"));
    }

    res.status(200).json(chats.messages.pop())
})

// @route    PUT api/v1/chat/:id/messages/:msgId
// @desc     Update Chat
// @access   private
const updateMessage = asyncHandler(async (req, res) => {
    const { params, body } = req

    const updateMessage = await Chat.findOneAndUpdate(
        { "messages._id": params.msgId },
        {
            $set: {
                "messages.$.content": body.content,
            },
        },
        {
            new: true,
            upsert: true,
            select: {
                messages: {
                    $elemMatch: { _id: params.msgId },
                },
            },
        },
    ).populate("messages.sender", "firstName lastName image")

    if (!updateMessage) {
        res.status(500);
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("message") }));
    }

    res.status(200).json(updateMessage.messages[0])
})

// @route    DELETE api/v1/chats/:id/messages/msgId
// @desc     Delete a Chat
// @access   private
const deleteMessage = asyncHandler(async (req, res) => {
    const { params } = req

    const deleteMessage = await Chat.findOneAndUpdate(
        { "messages._id": params.msgId },
        { $pull: { messages: { _id: params.msgId } } },
        {
            select: {
                messages: {
                    $elemMatch: { _id: params.msgId },
                },
            },
        },
    ).populate("messages.sender", "firstName lastName image")

    if (!deleteMessage) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("message") }));
    }

    res.status(200).json({ message: "message deleted!" })
})

export {
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
}