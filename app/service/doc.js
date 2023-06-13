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
		const { title, data, vendorId } = body;
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
			this.ctx.service.debug.create({ type: "doc", id, data: requestJson });
			return txn;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async find() {
		const txns = await this.ctx.model.Doc.find();
		if (!txns) {
			return undefined;
		}
		return txns;
	}

	async delete(id) {
		const txns = await this.ctx.model.Doc.deleteOne({ id });
		if (!txns) {
			console.log("Auto deleted failed, please delete this document manually!");
		}
		return txns;
	}
}

module.exports = DocService;
