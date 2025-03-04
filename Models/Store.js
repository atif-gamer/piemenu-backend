import mongoose, { Schema } from "mongoose";

const storeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timeseries: true });

export default Store = mongoose.model("Store", storeSchema);