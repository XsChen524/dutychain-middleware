"use strict";

const Controller = require("egg").Controller;

class InitializeController extends Controller {
	async index() {
		const { ctx } = this;

		const result = await this.ctx.service.auth.fabric.initialize();
		/*
		const admin1 = await ctx.service.auth.register({
			name: "admin1",
			password: "123456",
			email: "admin@org1.hk",
			organization: "Org1MSP",
			role: "vendor",
			isAdmin: true,
			wallet: "admin",
		});
		const admin2 = await ctx.service.auth.register({
			name: "admin2",
			password: "123456",
			email: "admin@org2.hk",
			organization: "Org2MSP",
			role: "vendor",
			isAdmin: true,
			wallet: "admin",
		});
		*/

		if (result /* && admin1 && admin2 */) {
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
