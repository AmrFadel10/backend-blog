const jwt = require("jsonwebtoken");

exports.tokenForSignup = ({ username, email, password }) => {
	return jwt.sign({ username, email, password }, process.env.JWT_SECRET, {
		expiresIn: "5m",
	});
};

exports.generateToken = ({ id, isAdmin }) => {
	return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
};
