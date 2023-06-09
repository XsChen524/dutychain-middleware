"use strict";

const Controller = require("egg").Controller;

class DebugController extends Controller {
	async index() {
		const { ctx } = this;
		ctx.body = 'hi, debugger';
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
		const ctx = this.ctx;
		const res = await ctx.service.debug.readAll();
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
