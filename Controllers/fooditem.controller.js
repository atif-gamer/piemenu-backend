import ApiError from "../Utils/ApiError";
import asyncHandler from "../Utils/asyncHandler"
import FoodItem from "../Models/FoodItem";
import ApiResponse from "../Utils/ApiResponse";
import Store from "../Models/Store";

const getStoreItems = asyncHandler(async (req, res) => {

    const store = req.store;

    if (!store) throw new ApiError(400, "No Store Found");

    try {

        const items = await FoodItem.find({ store: store._id });

        if (!items) throw new ApiError(500, "No Items Found");

        res.status(200).json(new ApiResponse(200, "Food items fetched successfully", items));

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.");
    }
})

const createItem = asyncHandler(async (req, res) => {
    const store = req.store;
    const { name, imageUrl = "", description, price, category } = req.body;

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
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.");
    }
})

const updateItem = asyncHandler(async (req, res) => {

    const { itemId } = req.params;

    const fieldsToUpdate = { name, description, price, category, isAvailable } = req.body;

    if (!Object.keys(fieldsToUpdate).length) throw new ApiError(400, "Nothing to update");

    try {

        const updatedItem = await FoodItem.findByIdAndUpdate(itemId, {
            $set: { ...fieldsToUpdate }
        }, { new: true })

        if (!updatedItem) throw new ApiError(500, "Something went wronge");

        res.status(200).json(new ApiResponse(200, "Food item updated Successfully", updatedItem));

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.")
    }
})

const deleteItem = asyncHandler(async (req, res) => {

    const { itemId } = req.params;

    try {

        const deletedItem = await FoodItem.findByIdAndDelete(itemId);

        if (!deletedItem) throw new ApiError(404, "Food item not found");

        if (!deletedItem) throw new ApiError(500, "Something went wronge");

        res.status(200).json(new ApiResponse(200, "Food item deleted Successfully", deletedItem));

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.")
    }
})

export {
    getStoreItems,
    createItem,
    updateItem,
    deleteItem,
}