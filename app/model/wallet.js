"use strict";

module.exports = (app) => {
	const mongoose = app.mongoose;
	const WalletSchema = new mongoose.Schema({
		walletId: {
			unique: true,
			type: Number,
			required: true,
			// autoIncrement: true,
		},
		wallet: {
			type: String,
			required: true,
			default: null,
		},
	});

	return mongoose.model('Wallet', WalletSchema);
};
