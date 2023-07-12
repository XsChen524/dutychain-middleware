"use strict";

const Controller = require("egg").Controller;

class DocumentController extends Controller {
	async index() {
		const ctx = this.ctx;
		const headers = {
			"Content-Type": "application/json",
		};
		ctx.set(headers);
		const { walletId, organizationId } = ctx.query;

		const documents = await ctx.service.document.document.findAllDocuments(
			"",
			"",
			walletId.toString(),
			organizationId
		);

		if (!documents) {
			ctx.body = {
				success: false,
				data: undefined,
			};
			return;
		}
		ctx.body = {
			success: true,
			data: documents,
		};
		return;
	}
}

module.exports = DocumentController;
