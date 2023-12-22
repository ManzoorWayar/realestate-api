import mongoose from "mongoose";

const EstateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    rooms: {
        type: String,
        required: true
    },
    bathrooms: {
        type: String,
        required: true
    },
    bedrooms: {
        type: String,
        required: true
    },
    garage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    location: {
        city: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    images: [{ type: String }],
    video: { type: String },
},
    {
        timestamps: true
    }
);

const Estate = mongoose.model('Estate', EstateSchema);

export default Estate;