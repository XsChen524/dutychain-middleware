"use strict";

const Controller = require("egg").Controller;

class AdministrationController extends Controller {
	async getAllOrgs() {
		const ctx = this.ctx;
		const orgs = await ctx.service.auth.administration.getOrganizations();
		if (!orgs) {
			ctx.body = {
				success: false,
				data: undefined,
			};
			return;
		}
		ctx.body = {
			success: true,
			data: orgs,
		};
		return;
	}

	async getUsersByOrg() {
		const { ctx } = this;
		const orgName = ctx.params.orgName;
		const users = await ctx.service.auth.administration.findUsersByOrg(orgName);
		if (!users) {
			ctx.body = {
				success: false,
				data: undefined,
			};
			return;
		}
		ctx.body = {
			success: true,
			data: users,
		};
		return;
	}

	/**
	 * register controller
	 * @return {object} {status, msg}
	 */
	async register() {
		const ctx = this.ctx;
		const existingUser = await ctx.service.auth.administration.checkUserName(ctx.request.body.name);
		if (existingUser[0]) {
			ctx.body = {
				success: false,
				data: undefined,
			};
			return;
		}
		const user = await ctx.service.auth.administration.register(ctx.request.body);
		ctx.body = {
			success: true,
			data: user,
		};
		return;
	}
}

module.exports = AdministrationController;
