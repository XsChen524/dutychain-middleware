"use strict";

const Controller = require("egg").Controller;

class DocumentController extends Controller {
	/**
	 * Get all documents from the Hyperledger
	 */
	async index() {
		const ctx = this.ctx;
		const headers = {
			"Content-Type": "application/json",
		};
		ctx.set(headers);

		/**
		 * @param {string} walletId walletId of type 'admin' | number
		 * @param {number} organizationId  organizationId of type number. For organization1, the id is 1.
		 */
		const { walletId, organizationId } = ctx.query;

		const documents = await ctx.service.document.fabric.readRange("", "", walletId.toString(), organizationId);

		if (!documents) {
			ctx.body = {
				success: false,
				data: undefined,
			};
			return;
		}

		const parsedDocumentArray = await (async (documents) => {
			const documentArr = [];
			return new Promise((resolve) => {
				for (let i = 0; i < documents.length; i += 1) {
					documentArr.push({
						key: Number(documents[i].Key),
						record: {
							data: documents[i].Record.data,
							id: Number(documents[i].Record.id),
							type: documents[i].Record.type,
						},
					});
				}
				resolve(documentArr);
			});
		})(documents);

		ctx.body = {
			success: true,
			data: parsedDocumentArray,
		};
		return;
	}
}

module.exports = DocumentController;
