"use strict";

const Service = require("egg").Service;
const Sequelize = require("sequelize");
const { randomString } = require("../utils/utils");

class TxnService extends Service {
	async create(body) {
		/**
		 * @param {String} vendorId Get string from request body,
		 * need stringfying at frontend.
		 */
		const { type, operatorId, description, fromVendor, toVendor } = body;
		try {
			const txn = await this.ctx.model.Txn.create({
				id:
					"0x000000000000000000000000000000000000000000000000" +
					randomString(16),
				blockId: 1,
				type,
				operatorId: Number(operatorId),
				description,
				fromVendor: Number(fromVendor),
				toVendor: Number(toVendor),
				createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
				committedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
			});
			return txn;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async findAll() {
		const txns = await this.ctx.model.Txn.findAll();
		if (!txns) {
			return undefined;
		}
		return txns;
	}
}

module.exports = TxnService;
