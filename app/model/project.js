"use strict";

module.exports = (app) => {
	const mongoose = app.mongoose;
	const ProjectSchema = new mongoose.Schema({
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
		vendorId: {
			// Need to convert to type number[] in service
			type: String,
			required: true,
			default: "[]",
		},
	});

	return mongoose.model('Project', ProjectSchema);
};
