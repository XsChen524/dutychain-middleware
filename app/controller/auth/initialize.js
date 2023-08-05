"use strict";

const Controller = require("egg").Controller;

class InitializeController extends Controller {
	async index() {
		const { ctx } = this;

		const [result, unencryptedPasswords, isFirstCalled] = await this.ctx.service.auth.fabric.initialize();
		let success = true;
		if (isFirstCalled) {
			for (const [key, value] of Object.entries(unencryptedPasswords)) {
				console.log(key, value); // Output default administrator passwords, just for debug!!!
				let previousId = (await this.ctx.model.Auth.User.find().sort({ id: -1 }))[0];
				previousId = previousId === undefined ? 0 : previousId.id;
				const hashPassword = await this.ctx.genHash(value);
				const admin = await this.ctx.model.Auth.User.create({
					id: previousId + 1,
					name: "admin" + key,
					password: hashPassword,
					email: "admin@org" + key + ".hk",
					organization: key,
					isAdmin: true,
					role: "vendor",
					walletId: "admin",
				});

				// const admin = await ctx.service.auth.administration.register({
				// 	name: "admin" + key,
				// 	password: value,
				// 	email: "admin@org" + key + ".hk",
				// 	organization: key,
				// 	role: "vendor",
				// 	isAdmin: true,
				// 	wallet: "admin",
				// });

				success = success && !!admin;
			}
		}


		if (result && success) {
			ctx.body = {
				success: true,
				data: result,
			};
			return;
		}
		ctx.body = {
			success: false,
			data: undefined,
		};

		return;
	}
}

module.exports = InitializeController;
