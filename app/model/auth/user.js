"use strict";

module.exports = (app) => {
	const mongoose = app.mongoose;
	const UserSchema = new mongoose.Schema({
		id: {
			unique: true,
			type: Number,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		organization: {
			type: String,
			required: false,
			default: "",
		},
		// Client or vendor
		role: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			require: false,
			default: false,
		},
	});
	return mongoose.model("User", UserSchema);
};
