const errorHandler = (error, req, res, next) => {
    if (error.name === 'ValidationError') {
        const errorMessages = Object.values(error.errors).map(error => error.message);
        return res.status(400).json({ error: 'Validation Error', messages: errorMessages });
    }
    console.error(error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = { errorHandler }