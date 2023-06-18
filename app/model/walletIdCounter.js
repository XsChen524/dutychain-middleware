"use strict";

module.exports = (app) => {
	const mongoose = app.mongoose;
	const WalletIdCounterSchema = new mongoose.Schema({
		id: {
			type: String
		},
		seq: {
			type: Number,
		},
	});

	return mongoose.model('WalletIdCounter', WalletIdCounterSchema);
};
