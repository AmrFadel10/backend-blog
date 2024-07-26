const joi = require("joi");

exports.updateUserValid = (obj) => {
	const schema = joi.object({
		username: joi.string().trim().min(2).max(20),
		password: joi.string().trim().min(8),
	});
	return schema.validate(obj);
};
