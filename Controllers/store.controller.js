import ApiError from "../Utils/ApiError";
import asyncHandler from "../Utils/asyncHandler";
import Store from "../Models/Store";
import ApiResponse from "../Utils/ApiResponse";

const createStore = asyncHandler(async (req, res) => {
    const user = req.user;
    const { name, converImage, address, contact } = req.body;

    if (!name || !address || !contact) throw new ApiError(400, "All fields required");

    const storeId = Date.now();

    try {

        const newStore = await Store.create({
            storeId,
            name,
            converImage,
            address,
            contact,
            owner: user._id
        })

        if (!newStore) throw new ApiError(500, "Something went wronge");

        res.status(201).json(new ApiResponse(201, "Store Created Successfully", newStore));

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.")
    }
})

const updateStore = asyncHandler(async (req, res) => {

    const store = req.store;
    const fieldsToUpdate = req.body;

    if (!Object.keys(fieldsToUpdate).length) throw new ApiError(400, "Nothing to update");

    try {

        const updatedStore = await Store.findByIdAndUpdate(store.id, {
            $set: { ...fieldsToUpdate }
        }, { new: true })

        if (!updatedStore) throw new ApiError(500, "Something went wronge");

        return res.status(200).json(new ApiResponse(209, "Store Created Successfully", updatedStore));

    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const getUserStores = asyncHandler(async (req, res) => {

    const user = req.user;

    if (!user) return new ApiError(403, "Unauthorized Request");

    try {

        const stores = await Store.find({ owner: user.id })

        console.log(stores);

        // If no store
        // if(!stores.length) return new ApiError(404, "No stores found");

        res.status(200).json(new ApiResponse(200, "Store fetched successfully", {
            stores
        }))


    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const getStoreById = asyncHandler(async (req, res) => {

    const store = req.store;

    try {

        if (!store) throw new ApiError(201, "Error fetching store");

        res.status(200).json(new ApiResponse(200, "Store fetched successfully", {
            store
        }))

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.")
    }
})

const viewStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;

    try {
        const store = await Store.find({ storeId })

        if (!store) throw new ApiError(404, "No store found");

        res.status(200).json(new ApiResponse(200, "Store fetched successfully", store));
    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

export {
    createStore,
    updateStore,
    getUserStores,
    getStoreById,
    viewStore
}