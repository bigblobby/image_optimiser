function errorResponseHandler(err, req, res, next){
    const name = err.name || 'UnhandledException';
    const status = err.statusCode || 500;
    const message = err.message || "Something is broken";

    res
        .status(status)
        .json({
            error: name,
            statusCode: status,
            message: message
        });
}

module.exports = errorResponseHandler;