import ApiError from "../Utils/ApiError.js";
import asyncHandler from "../Utils/asyncHandler.js"
import { FoodItem } from "../Models/FoodItem.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { Store } from "../Models/Store.js";
import { uploadImageToCloudinary } from "../Utils/Cloudinary.js";
import fs from 'fs';
import OpenAI from "openai";

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

    const imageFile = req.file;

    const store = req.store;
    const { name, description, price, category } = req.body;

    if (!name || !description || !price) throw new ApiError(400, "All Fields required");

    try {

        // Cloudinary 
        let imageUrl = ''; //set a placeholder url
        if (imageFile) {
            const uploadResponse = await uploadImageToCloudinary(imageFile);
            console.log(uploadResponse);
            imageUrl = uploadResponse.secure_url;
            if (uploadResponse?.error) throw new ApiError(500, "Something went wronge.");
        }

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

    const fieldsToUpdate = req.body;

    console.log(itemId);
    console.log(fieldsToUpdate);

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
    // const imageFile = req.files['image']?.[0];

    try {

        // Image
        // const imageResponse = await deleteImgFromCloudinary(cardToUpdate.image);
        // if (!imageResponse?.success) throw new ApiError(500, "Something went wronge.");

        // const uploadResponse = await uploadImageToCloudinary(imageFile);
        // if (uploadResponse?.error) throw new ApiError(500, "Something went wronge.");

        const deletedItem = await FoodItem.findByIdAndDelete(itemId);

        if (!deletedItem) throw new ApiError(404, "Food item not found");

        if (!deletedItem) throw new ApiError(500, "Something went wronge");

        res.status(200).json(new ApiResponse(200, "Food item deleted Successfully", deletedItem));

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.")
    }
})

const extractMenuItems = asyncHandler(async (req, res) => {
    // console.log(req.file);

    const imagePath = req.file.path;

    if (!imagePath) throw new ApiError(400, "No image uploaded");

    try {

        // Read file content
        console.log(imagePath);
        const base64Image = fs.readFileSync(imagePath, "base64");

        // Prepare prompt for OpenAI
        const prompt = `Extract a list of dish names from the following restaurant menu text. 
            Only return the dish names as a JSON array.Menu`;

        // Call OpenAI API
        const client = new OpenAI();

        const response = await client.responses.create({
            model: "gpt-4.1",
            input: [
                {
                    role: "user",
                    content: [
                        { type: "input_text", text: prompt },
                        {
                            type: "input_image",
                            image_url: `data:image/jpeg;base64,${base64Image}`,
                        },
                    ],
                },
            ],
        });

        console.log(response);

        // Parse response
        const dishes = JSON.parse(response.output_text);

        res.status(200).json(new ApiResponse(200, "Menu items extracted successfully", dishes));
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to extract menu items");
    }
    finally {
        fs.unlink(imagePath, () => { });
    }
});

export {
    getStoreItems,
    createItem,
    updateItem,
    deleteItem,
    extractMenuItems
}