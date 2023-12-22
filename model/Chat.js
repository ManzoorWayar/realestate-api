import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: { type: String },
    }],
},
    {
        timestamps: true,
    }
)

const Chat = mongoose.model("Chat", ChatSchema)

export default Chat
