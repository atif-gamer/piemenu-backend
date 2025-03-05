import asyncHandler from "../Utils/asyncHandler";
import ApiError from "../Utils/ApiError";
import Store from "../Models/Store";

const verifyStore = asyncHandler(async (req, res, next) => {

    const { user } = req.body;
    const { storeId } = req.params;
    if (!user) throw new ApiError(401, "Unauthorized Request");

    try {
        const store = await Store.find({ storeId })

        if (!store) throw new ApiError(404, "No store found");

        if (store.owner != user.id) throw new ApiError(401, "Unauthorized Request");

        req.store = store;

        next();

    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
});

export default verifyStore;