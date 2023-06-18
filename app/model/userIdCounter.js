"use strict";


// not used, for demo only
module.exports = (app) => {
	const mongoose = app.mongoose;
	const UserIdCounterSchema = new mongoose.Schema({
		id: {
			type: String
		},
		seq: {
			type: Number,
		},
	});

	return mongoose.model('userIdCounter', UserIdCounterSchema);
};
