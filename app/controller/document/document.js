"use strict";

const Controller = require("egg").Controller;

class DocumentController extends Controller {
	/**
	 * Get all documents from the Hyperledger
	 */
	async index() {
		const ctx = this.ctx;
		ctx.set({
			"Content-Type": "application/json",
		});

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
						key: documents[i].Key,
						record: {
							data: documents[i].Record.data,
							id: documents[i].Record.id,
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

	/**
	 * Find a document by documentId
	 */
	async find() {
		const ctx = this.ctx;
		ctx.set({
			"Content-Type": "application/json",
		});
		const documentId = ctx.params.id;
		const { walletId, organizationId } = ctx.query;

		const document = await ctx.service.document.fabric.readAsset(documentId, walletId.toString(), organizationId);

		if (!document) {
			ctx.body = {
				success: false,
				data: undefined,
			};
		}
		ctx.body = {
			success: true,
			data: document,
		};
		return;
	}

	/**
	 * Create a document
	 */
	async create() {
		const ctx = this.ctx;
		ctx.set({
			"Content-Type": "application/json",
		});

		const id = ctx.request.body.id;
		const data = JSON.stringify(ctx.request.body.data);
		const { type, walletId } = ctx.request.body;
		const orgId = ctx.request.body.org.toString();

		const document = await ctx.service.document.fabric.createAsset(id, type, data, walletId, orgId);

		if (document) {
			ctx.body = {
				success: true,
				data: document,
			};
			return;
		}
		ctx.body = {
			success: false,
			data: undefined,
		};
		return;
	}
}

module.exports = DocumentController;
