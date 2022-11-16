module.exports =  class InternalServerErrorException extends Error {
    constructor(message) {
        super(message);
        this.name = "InternalServerErrorException";
        this.statusCode = 500;
    }
}