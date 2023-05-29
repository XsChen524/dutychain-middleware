"use strict";

const Controller = require("egg").Controller;

class TxnController extends Controller {
	async createTxn() {
		const { ctx } = this;
		const txn = await ctx.service.txn.create(ctx.request.body);
		if (!txn) {
			ctx.status = 406;
			ctx.body = undefined;
			return;
		}
		ctx.status = 201;
		ctx.body = txn;
		return;
	}

	async getAllTxns() {
		const ctx = this.ctx;
		const txns = await ctx.service.txn.findAll();
		if (txns) {
			ctx.status = 200;
		} else {
			ctx.status = 400;
		}
		ctx.body = txns;
		return;
	}
}

module.exports = TxnController;
