import mongoose, { Schema } from "mongoose";

const storeSchema = new Schema({
    storeId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timeseries: true });

export default Store = mongoose.model("Store", storeSchema);