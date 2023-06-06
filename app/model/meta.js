"use strict";

module.exports = (app) => {
	const mongoose = app.mongoose;
	const MetaSchema = new mongoose.Schema({
		id: {
			unique: true,
			type: Number,
			required: true,
			// autoIncrement: true,
		},
		name: {
			type: String,
			maxlength: 100,
			minlength: 0,
			required: true,
		},
		description: {
			type: String,
			maxlength: 200,
			minlength: 0,
			required: true,
			default: null,
		},
		projectId: {
			type: Number,
			required: true,
		},
		previousTxns: {
			// Need to convert to type number[] in service
			type: String,
			required: true,
			default: "[]",
		},
	});

	return mongoose.model('Meta', MetaSchema);
};
