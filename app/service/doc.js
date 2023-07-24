"use strict";

const Service = require("egg").Service;
const crypto = require('crypto');
const { randomString } = require("../utils/utils");

class DocService extends Service {
	async insert(body) {
		/**
		 * @param {Object} data Get string from request body,
		 * need stringfying at frontend.
		 */
		console.log(body);
		const { title, data, vendorId, walletId, org } = body;
		const id = "0x000000000000000000000000000000000000000000000000" + randomString(16);
		try {
			const txn = await this.ctx.model.Doc.insertMany([{
				id,
				title,
				data,
				vendorId: Number(vendorId),
			}]);

			const str = JSON.stringify({ title, data, vendorId });
			const hash = crypto.createHmac('sha256', '123456')
				.update(str, 'utf8')
				.digest('hex');
			const requestJson = {
				hash,
				vendorId,
			};
			await this.ctx.service.debug.create({ type: "doc", id, data: requestJson, walletId, org });
			return txn;
		} catch (error) {
			console.error(error);
			try {
				await this.ctx.service.doc.delete(id);
			} catch (error) {
				console.error(error);
				console.log("Auto deletion failed, please delete this document manually.");
			}
			return undefined;
		}
	}

	async find(body) {
		console.log(body);
		// const { id, title, data, vendorId } = body;
		const txns = await this.ctx.model.Doc.find(body);
		if (!txns) {
			return undefined;
		}
		return txns;
	}

	async delete(id) {
		// throw new Error('Deletion failed.');
		const txns = await this.ctx.model.Doc.deleteOne({ id });
		if (!txns) {
			console.log("Auto deleted failed, please delete this document manually!");
		}
		return txns;
	}
}

module.exports = DocService;
