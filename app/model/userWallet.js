"use strict";


// not used, for demo only
module.exports = (app) => {
	const mongoose = app.mongoose;
	const UserWalletSchema = new mongoose.Schema({
		userId: {
			unique: true,
			type: Number,
			required: true,
		},
		walletId: {
			type: Number,
		},
	});

	return mongoose.model('UserWallet', UserWalletSchema);
};
