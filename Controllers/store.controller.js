import ApiError from "../Utils/ApiError";
import asyncHandler from "../Utils/asyncHandler";
import Store from "../Models/Store";
import ApiResponse from "../Utils/ApiResponse";

const createStore = asyncHandler(async (req, res) => {
    const { user, name, converImage, address, contact } = req.body;

    if (!user || !name || address || !contact) return new ApiError(209, "All fields required");

    try {

        const newStore = await Store.create({
            name,
            converImage,
            address,
            contact,
            owner: user._id
        })

        if (!newStore) throw new ApiError(500, "Something went wronge");

        return res.status(200).json(new ApiResponse(209, "Store Created Successfully", newStore));

    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const updateStore = asyncHandler(async (req, res) => {

    const { user, name, converImage, address, contact, store } = req.body;

    try {

        // Expreiemnt: Should we update the info in store we get from store middlware or we should use the function findAndUpdateById ?

        const updatedStore = await Store.findByIdAndUpdate(store.id, {
            $set: {
                name,
                converImage,
                address,
                contact,
                owner: user._id
            }
        }, { new: true })

        if (!updatedStore) throw new ApiError(500, "Something went wronge");

        return res.status(200).json(new ApiResponse(209, "Store Created Successfully", updatedStore));

    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const getUserStores = asyncHandler(async (req, res) => {

    const user = req.user;

    if (!user) return new ApiError(201, "Unauthorized Request");

    try {

        const stores = await Store.find({ owner: user.id })

        console.log(stores);

        // If no store
        // if(!stores) return new

        res.status(200).json(new ApiResponse(200, "Store fetched successfully", {
            stores
        }))


    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const getStoreById = asyncHandler(async (req, res) => {

    const { store } = req.body;

    try {

        if (!store) throw new ApiError(201, "Error fetching store");

        res.status(200).json(new ApiResponse(200, "Store fetched successfully", {
            store
        }))

    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const closeStore = asyncHandler(async (req, res) => {
    const { store } = req.body;

    try {

        // Expreiemnt: Should we update the info in store we get from store middlware or we should use the function findAndUpdateById ?

        const updatedStore = await Store.findByIdAndUpdate(store.id, {
            $set: {
                isActive: false
            }
        }, { new: true });

        if (!updatedStore) throw new ApiError(201, "Store not found");

        res.status(200).json(new ApiResponse(200, "Sotre closed successfully", updatedStore));
    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const reopenStore = asyncHandler(async (req, res) => {
    const { store } = req.body;

    try {

        // Expreiemnt: Should we update the info in store we get from store middlware or we should use the function findAndUpdateById ?

        const updatedStore = await Store.findByIdAndUpdate(store.id, {
            $set: {
                isActive: true
            }
        }, { new: true });

        if (!updatedStore) throw new ApiError(201, "Store not found");

        res.status(200).json(new ApiResponse(200, "Sotre closed successfully", updatedStore));
    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const viewStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;

    try {
        const store = await Store.find({ storeId })

        if (!store) throw new ApiError(404, "No store found");

        res.status(200).json(200, "Store fetched successfully", store);
    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

export {
    createStore,
    updateStore,
    getUserStores,
    getStoreById,
    closeStore,
    reopenStore,
    viewStore
}