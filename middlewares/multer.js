const path = require("path");
const multer = require("multer");
const HandleError = require("../utils/handleError");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const location = path.join(__dirname, "../images");
		cb(null, location);
	},
	filename: (req, file, cb) => {
		if (file) {
			const suffix =
				new Date().toISOString().replace(/:/g, "-") +
				Math.random() * 1e9 +
				file.originalname;
			cb(null, suffix);
		} else {
			cb(null, null);
		}
	},
});

exports.upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			cb({ message: "Not support this type of file" }, false);
		}
	},
	limits: {
		fileSize: 2 * 1024 * 1024,
	},
});
