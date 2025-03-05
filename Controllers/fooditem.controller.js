import ApiError from "../Utils/ApiError";
import asyncHandler from "../Utils/asyncHandler"
import FoodItem from "../Models/FoodItem";
import ApiResponse from "../Utils/ApiResponse";
import Store from "../Models/Store";

const createItem = asyncHandler(async (req, res) => {

    const { name, imageUrl = "", description, price, category, store } = req.body;

    if (!name || !description || !price) throw new ApiError(400, "All Fields required");

    try {

        const newFoodItem = await FoodItem.create({
            name,
            description,
            imageUrl,
            price,
            store: store._id,
        })

        if (!newFoodItem) throw new ApiError(500, "Something went wronge");

        res.status(201).json(new ApiResponse(201, "Food item added successfully", newFoodItem));

    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const updateItem = asyncHandler(async (req, res) => {

    const { itemId } = req.params;
    const { name, description, price, category, isAvailable, store } = req.body;

    if (!name || !description || !price) throw new ApiError(400, "All Fields required");

    try {
        // Expreiemnt: Should we update the info in store we get from store middlware or we should use the function findAndUpdateById ?

        const updatedItem = await Store.findByIdAndUpdate(itemId, {
            $set: {
                name,
                description,
                price,
                isAvailable,
                owner: user._id
            }
        }, { new: true })

        if (!updatedItem) throw new ApiError(500, "Something went wronge");

        return res.status(200).json(new ApiResponse(209, "Food item updated Successfully", updatedItem));

    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

const deleteItem = asyncHandler(async (req, res) => {

    try {

        // Expreiemnt: Should we update the info in store we get from store middlware or we should use the function findAndUpdateById ?

        const deletedItem = await Store.findByIdAndDelete(store.id);

        if (!deletedItem) throw new ApiError(500, "Something went wronge");

        return res.status(200).json(new ApiResponse(209, "Food item deleted Successfully", deletedItem));

    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }
})

export {
    createItem,
    updateItem,
    deleteItem,

}