"use strict";

module.exports = (app) => {
	const mongoose = app.mongoose;
	const OrgSchema = new mongoose.Schema({
		id: {
			unique: true,
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	});
	return mongoose.model("Organization", OrgSchema);
};
