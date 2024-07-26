const joi = require("joi");

exports.createUserValid = (obj) => {
	const schema = joi.object({
		username: joi.string().trim().min(2).max(20).required(),
		email: joi.string().email().trim().min(5).max(100).required(),
		password: joi.string().trim().min(8).required(),
	});
	return schema.validate(obj);
};

exports.loginUserValid = (obj) => {
	const schema = joi.object({
		email: joi.string().email().trim().min(5).max(100).required(),
		password: joi.string().trim().min(8).required(),
	});
	return schema.validate(obj);
};
