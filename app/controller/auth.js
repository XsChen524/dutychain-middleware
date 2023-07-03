"use strict";

const Controller = require("egg").Controller;

class AuthController extends Controller {
	async getAllOrgs() {
		const ctx = this.ctx;
		const orgs = await ctx.service.auth.getOrganizations();
		if (!orgs) {
			ctx.status = 400;
			ctx.body = {
				success: false,
				data: undefined,
			};
			return;
		}
		ctx.status = 200;
		ctx.body = {
			success: true,
			data: orgs,
		};
		return;
	}

	/**
	 * register controller
	 * @return {object} {status, msg}
	 */
	async register() {
		const ctx = this.ctx;
		const user = await ctx.service.auth.checkUserName(
			ctx.request.body.name
		);
		if (user[0]) {
			ctx.status = 406;
			ctx.body = {
				success: false,
				msg: "User already exist",
				data: undefined,
			};
			return;
		}
		await ctx.service.auth.register(ctx.request.body);
		ctx.status = 201;
		ctx.body = {
			success: true,
			msg: "sign up successfully",
			data: user[0],
		};
		return;
	}

	/**
	 * login controller
	 * @return {object} {status, email, token}
	 */
	async login() {
		const ctx = this.ctx;
		const data = await ctx.service.auth.loginByName(ctx.request.body);
		if (!data) {
			ctx.status = 401;
			ctx.body = {
				success: false,
				msg: "Wrong username or password",
				data: undefined,
			};
			return;
		}
		ctx.status = 200;
		ctx.body = { success: true, msg: "Login successfully", data };
		return;
	}

	async index() {
		const { ctx } = this;
		ctx.body = { success: true, data: ctx.state.user };
		return;
	}
}

module.exports = AuthController;
