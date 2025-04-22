import ApiError from "../Utils/ApiError.js";

const validateId = (req, res, next, value) => {

    if (!Number(value))
        throw new ApiError(400, "Id is incorrect");

    next();
}

export default validateId;