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
		try {
			const txn = await this.ctx.model.Doc.insertMany([{
				id:
					"0x000000000000000000000000000000000000000000000000" +
					randomString(16),
				title,
				data,
				vendorId: Number(vendorId),
			}]);

			/** **********************/
			const str = JSON.stringify({ title, data, vendorId });
			console.log(str);
			const hash = crypto.createHmac('sha256', '123456')
				.update(str, 'utf8')
				.digest('hex');
			console.log(hash);
			const requestJson = {
				hash,
				vendorId,
			};
			console.log(JSON.stringify(requestJson));
			this.ctx.service.debug.create({ type: "doc", data: requestJson });
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
}

module.exports = DocService;
