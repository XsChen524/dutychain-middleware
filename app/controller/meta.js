"use strict";

const Controller = require("egg").Controller;

class MetaController extends Controller {
	async createResponsibility() {
		const { ctx } = this;
		const meta = await ctx.service.meta.create(ctx.request.body);
		if (!meta) {
			ctx.status = 406;
			ctx.body = undefined;
			return;
		}
		ctx.status = 201;
		ctx.body = meta;
		return;
	}

	async getAllResponsibilities() {
		const ctx = this.ctx;
		const metas = await ctx.service.meta.findAll();
		if (metas) {
			ctx.status = 200;
		} else {
			ctx.status = 400;
		}
		ctx.body = metas;
		return;
	}
}

module.exports = MetaController;
