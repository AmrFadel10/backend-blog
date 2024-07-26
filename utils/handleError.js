class HandleError extends Error {
	constructor(statusCode, message) {
		super(message);
		this.statusCode = statusCode;
		this.state = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
		this.operational = true;
	}
}

module.exports = HandleError;
