import ApiError from "../Utils/ApiError.js";

export default validateId = (req, res, next, value) => {

    if (!Number(value))
        throw new ApiError(400, "Id is incorrect");

    next();
}