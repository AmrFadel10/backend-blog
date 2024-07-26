const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const authToken = req.headers.authorization;
	if (authToken) {
		const token = authToken.split(" ")[1];
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
			next();
		} catch (error) {
			return res.status(401).json({ message: "Invalid token, access denied!" });
		}
	} else {
		return res
			.status(401)
			.json({ message: "No token provided, access denied!" });
	}
};

const isAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next();
		} else {
			return res.status(403).json({ message: "No allowed, just admins!" });
		}
	});
};

const isUserHimself = (req, res, next) => {
	verifyToken(req, res, () => {
		console.log("welo");
		if (req.user.id.toString() === req.params.id) {
			next();
		} else {
			return res
				.status(403)
				.json({ message: "No allowed, Only user homself!" });
		}
	});
};

const isUserHimselfOrAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		console.log(req.user);
		if (req.params.id === req.user.id || req.user.isAdmin) {
			console.log("object");
			next();
		} else {
			res.status(403).json({ message: "Not allowed, Admin or user himself!" });
		}
	});
};
module.exports = { isAdmin, verifyToken, isUserHimself, isUserHimselfOrAdmin };
