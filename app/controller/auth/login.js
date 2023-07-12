"use strict";

const Controller = require("egg").Controller;

class AuthController extends Controller {
	/**
	 * login controller
	 * @return {object} {status, email, token}
	 */
	async login() {
		const ctx = this.ctx;
		const data = await ctx.service.auth.login.loginByName(ctx.request.body);
		console.log(data);
		if (!data) {
			ctx.body = {
				success: false,
				msg: "Wrong username or password",
				data: undefined,
			};
			return;
		}
		ctx.body = { success: true, data };
		return;
	}
}

module.exports = AuthController;
