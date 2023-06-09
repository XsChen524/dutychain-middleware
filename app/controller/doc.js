"use strict";

const Controller = require("egg").Controller;

class DocController extends Controller {
	async uploadDoc() {
		const { ctx } = this;
		const doc = await ctx.service.doc.insert(ctx.request.body);
		if (!doc) {
			ctx.status = 406;
			ctx.body = undefined;
			return;
		}
		ctx.status = 201;
		ctx.body = doc;
		return;
	}

	async getDocList() {
		const { ctx } = this;
		const docs = await ctx.service.doc.find();
		if (docs) {
			ctx.status = 200;
		} else {
			ctx.status = 400;
		}
		ctx.body = docs;
		// ctx.body = 'document';
		return;
	}
}

module.exports = DocController;
