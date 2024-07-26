const joi = require("joi");

exports.createPostValid = (obj) => {
	const schema = joi.object({
		title: joi.string().trim().min(2).max(100).required(),
		description: joi.string().trim().min(2).max(100).required(),
		category: joi.string().trim().required(),
	});
	return schema.validate(obj);
};

exports.updatePostValid = (obj) => {
	const schema = joi.object({
		title: joi.string().trim().min(2).max(100),
		description: joi.string().trim().min(2).max(100),
		category: joi.string().trim(),
	});
	return schema.validate(obj);
};
