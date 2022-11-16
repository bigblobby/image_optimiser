module.exports = class CustomException extends Error {
    constructor(message, statusCode = 500, name = 'CustomException') {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}