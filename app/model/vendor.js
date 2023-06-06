"use strict";

module.exports = (app) => {
	const mongoose = app.mongoose;
	const VendorSchema = new mongoose.Schema({
		id: {
			unique: true,
			type: Number,
			required: true,
			// autoIncrement: true,
		},
		name: {
			type: String,
			maxlength: 100,
			minlength: 100,
			required: true,
		},
		description: {
			type: String,
			maxlength: 200,
			minlength: 200,
			required: true,
			default: null,
		},
		role: {
			type: String,
			maxlength: 100,
			minlength: 100,
			required: true,
			default: "contractor",
		},
	});

	return mongoose.model('Vendor', VendorSchema);
};
