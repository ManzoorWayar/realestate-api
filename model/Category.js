import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        index: true,
        enum: ["apartment", "building"]
    }
},
    {
        timestamps: true
    }
);

const Category = mongoose.model('Category', CategorySchema);

export default Category