"use strict";

const Controller = require("egg").Controller;

class InitializeController extends Controller {
	async index() {
		const { ctx } = this;

		const [result, unencryptedPasswords, isFirstCalled] = await this.ctx.service.auth.fabric.initialize();
		let success = true;
		if (isFirstCalled) {
			for (const [key, value] of Object.entries(unencryptedPasswords)) {
				const admin = await ctx.service.auth.administration.register({
					name: "admin" + key,
					password: value,
					email: "admin@org" + key + ".hk",
					organization: key,
					role: "vendor",
					isAdmin: true,
					wallet: "admin",
				});

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
