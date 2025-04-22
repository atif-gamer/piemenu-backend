const asyncHandler = (requesHanlder) => {
    return function (req, res, next) {
        Promise.resolve(requesHanlder(req, res, next))
            .catch(err => next(err));
    }
}

export default asyncHandler;