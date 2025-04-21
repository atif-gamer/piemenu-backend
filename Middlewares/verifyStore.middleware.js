import asyncHandler from "../Utils/asyncHandler";
import ApiError from "../Utils/ApiError";
import Store from "../Models/Store";

const verifyStore = asyncHandler(async (req, res, next) => {

    const user = req.user;
    const { storeId } = req.params;
    if (!user) throw new ApiError(401, "Unauthorized Request");

    try {
        const store = await Store.findOne({ storeId })

        if (!store) throw new ApiError(404, "No store found");

        if (user.id != String(store.owner)) throw new ApiError(401, "Unauthorized Request");

        req.store = store;

        next();

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.")
    }
});

export default verifyStore;