"use strict";

module.exports = (app) => {
	const mongoose = app.mongoose;
	const TxnSchema = new mongoose.Schema({
		id: {
			// Digest length 66 for Ethereum, need to confirm HF
			unique: true,
			type: String,
			maxlength: 66,
			minlength: 66,
			required: true,
		},
		blockId: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		operatorId: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			maxlength: 200,
			minlength: 200,
			required: true,
			default: null,
		},
		fromVendor: {
			type: Number,
			required: true,
		},
		toVendor: {
			type: Number,
			required: true,
		},
		createdAt: {
			type: Date,
			required: true,
		},
		committedAt: {
			type: Date,
			required: true,
		},
	});

	return mongoose.model('Txn', TxnSchema);
};
