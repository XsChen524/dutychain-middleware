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
		const vendorId = ctx.state.user.id;
		const vendor = (await ctx.model.Auth.User.find({ id: vendorId }))[0];
		console.log("Vendor:",vendor);
		const { isAdmin, organization } = vendor;
		if (!isAdmin){
			ctx.body = {
				success: false,
				data: "Permission denied!"
			};
			return;
		}
		const existingUser = await ctx.service.auth.administration.checkUserName(ctx.request.body.name);
		console.log("ExistingUser:",existingUser);
		if (existingUser[0]) {
			ctx.body = {
				success: false,
				data: "User already exists!",
			};
			return;
		}
		const param = {
			name: ctx.request.body.name, 
			password: ctx.request.body.password, 
			email: ctx.request.body.email, 
			organization, 
			role: ctx.request.body.role, 
			isAdmin: false
		};
		console.log("Register param:",param);
		const user = await ctx.service.auth.administration.register(param);
		ctx.body = {
			success: true,
			data: user,
		};
		return;
	}
}

module.exports = AdministrationController;
