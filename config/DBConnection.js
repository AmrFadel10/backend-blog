const mongoose = require("mongoose");

module.exports = async function DbConnection() {
	try {
		await mongoose.connect(process.env.DB_URI);
		console.log("Connecting with Database ^_^");
	} catch (error) {
		console.log("Database Error:", error);
	}
};
