// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    const isJoiError = err?.error?.isJoi;
    if (isJoiError) {
        res.status(400).json({
            message: `💥 Validation errors in request ${err.type}`,
            errors: err.error.details.map(item => ({
                field: item.context.key,
                description: item.message
            }))
        });
    } else {
        res.status(500).send('💥 Something went wrong');
    }
};
