"use strict";

const Controller = require("egg").Controller;

class DocController extends Controller {
	async uploadDoc() {
		const { ctx } = this;
		const vendorId = ctx.state.user.id;
		const { walletId, organization } = (await ctx.model.Auth.User.find({ id: vendorId }))[0];
		const { title, data } = ctx.request.body;
		const doc = await ctx.service.doc.insert({ title, data, vendorId, walletId, org: organization });
		if (!doc) {
			ctx.status = 406;
			ctx.body = {
				success: false,
				data: undefined,
			};
			return;
		}
		ctx.status = 201;
		ctx.body = {
			success: true,
			data: doc,
		};
		return;
	}

	async getDocList() {
		const { ctx } = this;
		const docs = await ctx.service.doc.find();
		if (docs) {
			ctx.status = 200;
			ctx.body = {
				success: true,
				data: docs,
			};
		} else {
			ctx.status = 400;
			ctx.body = {
				success: false,
				data: undefined,
			};
		}
		// ctx.body = 'document';
		return;
	}

	async queryDoc() {
		const { ctx } = this;
		const docs = await ctx.service.doc.find(ctx.request.body);
		if (docs) {
			ctx.status = 200;
			ctx.body = {
				success: true,
				data: docs,
			};
		} else {
			ctx.status = 400;
			ctx.body = {
				success: false,
				data: undefined,
			};
		}
		// ctx.body = 'document';
		return;
	}

	async validateDoc() {
		const { ctx } = this;
		const userId = ctx.state.user.id;
		const { walletId, organization } = (await ctx.model.Auth.User.find({ id: userId }))[0];
		const { id } = ctx.request.body;
		const asset = await ctx.service.debug.read({ id, walletId, org: organization });
		if (asset) {
			ctx.status = 200;
			ctx.body = {
				success: true,
				data: asset,
			};
		} else {
			ctx.status = 400;
			ctx.body = {
				success: false,
				data: undefined,
			};
		}
		// ctx.body = 'document';
		return;
	}
}

module.exports = DocController;
