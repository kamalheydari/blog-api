exports.errorCreator = function(message, status, data) {
    const error = new Error(message);
    error.statusCode = status;
    error.data = data;
    throw error;
};