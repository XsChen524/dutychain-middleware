"use strict";


// not used, for demo only
module.exports = (app) => {
	const mongoose = app.mongoose;
	const userSchema = new mongoose.Schema({
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
		role: {
			type: String,
			maxlength: 100,
			minlength: 0,
			required: true,
			default: "contractor",
		},
	});

	return mongoose.model('User', userSchema);
};
