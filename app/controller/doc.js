"use strict";

const Controller = require("egg").Controller;

class DocController extends Controller {
	async uploadDoc() {
		const { ctx } = this;
		const doc = await ctx.service.doc.insert(ctx.request.body);
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
}

module.exports = DocController;
