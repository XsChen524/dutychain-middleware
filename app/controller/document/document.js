"use strict";

const Controller = require("egg").Controller;

class DocumentController extends Controller {
	/**
	 * Get all documents from the Hyperledger
	 */
	async index() {
		const ctx = this.ctx;
		// ctx.set({
		// 	"Content-Type": "application/json",
		// });

		// /**
		//  * @param {string} walletId walletId of type 'admin' | number
		//  * @param {number} organizationId  organizationId of type number. For organization1, the id is 1.
		//  */
		// const { walletId, organizationId } = ctx.query;
		const vendorId = ctx.state.user.id;
		const { walletId, organization } = (await ctx.model.Auth.User.find({ id: vendorId }))[0];
		const documents = await ctx.service.document.fabric.readRange("", "", walletId.toString(), organization);

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

	async find() {
		const { ctx } = this;
		if (ctx.params.id) {
			ctx.request.body.id = ctx.params.id;
		}
		const docs = await ctx.service.document.database.find(ctx.request.body);
		ctx.status = 200;
		if (docs.length !== 0) {
			ctx.body = {
				success: true,
				data: docs.map((value, index) => {
					return {
						id: value.id,
						title: value.title,
						data: value.data,
						vendorId: value.vendorId
					}
				}),
			};
		} else {
			ctx.body = {
				success: false,
				data: undefined,
			};
		}
		// ctx.body = 'document';
		return;
	}

	/**
	 * Find a digest record by documentId
	 */
	async validate() {
		const ctx = this.ctx;
		const vendorId = ctx.state.user.id;
		const { walletId, organization } = (await ctx.model.Auth.User.find({ id: vendorId }))[0];
		// ctx.set({
		// 	"Content-Type": "application/json",
		// });
		const documentId = ctx.params.id;
		// const { walletId, organizationId } = ctx.query;

		const document = await ctx.service.document.database.validate(documentId, walletId.toString(), organization);

		if (!document.success) {
			ctx.body = {
				success: false,
				data: document.log,
			};
			return;
		}
		ctx.body = {
			success: true,
			// data: document,
		};
		return;
	}

	/**
	 * Create a document
	 */
	async create() {
		const ctx = this.ctx;
		// ctx.set({
		// 	"Content-Type": "application/json",
		// });

		// const id = ctx.request.body.id;
		// const data = JSON.stringify(ctx.request.body.data);
		// const { type, walletId } = ctx.request.body;
		// const orgId = ctx.request.body.org.toString();

		// const document = await ctx.service.document.fabric.createAsset(id, type, data, walletId, orgId);

		const vendorId = ctx.state.user.id;
		const { walletId, organization } = (await ctx.model.Auth.User.find({ id: vendorId }))[0];
		const { title, data } = ctx.request.body;
		const document = await ctx.service.document.database.insert({ title, data, vendorId, walletId, org: organization });

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
