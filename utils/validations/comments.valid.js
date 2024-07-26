const joi = require("joi");

exports.createCommentValid = (obj) => {
	const schema = joi.object({
		text: joi.string().required().label("Text"),
		post: joi.string().required().label("Post id"),
	});
	return schema.validate(obj);
};

exports.updateCommentValid = (obj) => {
	const schema = joi.object({
		text: joi.string().label("Text"),
	});
	return schema.validate(obj);
};
