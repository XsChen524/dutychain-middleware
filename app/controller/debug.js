"use strict";

const Controller = require("egg").Controller;

class DebugController extends Controller {
	async index() {
		const { ctx } = this;
		ctx.body = "hi, debugger";
	}

	async create() {
		const { ctx } = this;
		const res = await ctx.service.debug.create(ctx.request.body);
		if (!res) {
			ctx.status = 406;
			ctx.body = undefined;
			return;
		}
		ctx.status = 201;
		ctx.body = res;
		return;
	}

	async readAll() {
		const { ctx } = this;
		const res = await ctx.service.debug.readAll(ctx.request.body);
		if (res) {
			ctx.status = 200;
		} else {
			ctx.status = 400;
		}
		ctx.body = res;
		return;
	}

	async read() {
		const { ctx } = this;
		const res = await ctx.service.debug.read(ctx.request.body);
		if (!res) {
			ctx.status = 406;
		} else {
			ctx.status = 201;
		}
		ctx.body = res;
		return;
	}

	async init() {
		const ctx = this.ctx;
		const res = await ctx.service.debug.init();
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
		if (res && admin1 && admin2) {
			ctx.status = 200;
		} else {
			ctx.status = 400;
		}
		ctx.body = res;
		return;
	}

	async debugReadAll() {
		const ctx = this.ctx;
		const res = await ctx.service.debug.debugReadAll();
		if (res) {
			ctx.status = 200;
		} else {
			ctx.status = 400;
		}
		ctx.body = res;
		return;
	}
}

module.exports = DebugController;
