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
        default: "",
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
    },
    collection: {
        type: String,
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store"
    }
}, { timestamps: true });

export const FoodItem = mongoose.model("Item", itemSchema);