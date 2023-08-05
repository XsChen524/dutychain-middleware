"use strict";

module.exports = (app) => {
	const mongoose = app.mongoose;
	const DocSchema = new mongoose.Schema({
		id: {
			// Digest length 66 for Ethereum, need to confirm HF
			unique: true,
			type: String,
			maxlength: 66,
			minlength: 66,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		data: {
			type: String,
			required: true,
		},
		vendorId: {
			type: Number,
			required: true,
		},
	});
	return mongoose.model('Doc', DocSchema);
};