import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store"
    }
}, { timestamps: true });

export default Item = mongoose.model("Item", itemSchema);