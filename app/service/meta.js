"use strict";

const Service = require("egg").Service;
const { strToStrArray } = require("../utils/utils");

class MetaService extends Service {
	async create(body) {
		const { name, description, projectId, previousTxns } = body;
		let previousId = (await this.ctx.model.Meta.find().sort({ id: -1 }))[0];
		previousId = previousId === undefined ? 0 : previousId.id;
		try {
			const meta = await this.ctx.model.Meta.insertMany([{
				id: previousId + 1,
				name,
				description,
				projectId: Number(projectId),
				previousTxns,
			}]);

			const str = JSON.stringify({ id, name, description, projectId, previousTxns });
			const hash = crypto.createHmac('sha256', '123456')
				.update(str, 'utf8')
				.digest('hex');
			const requestJson = { id, hash };
			this.ctx.service.debug.create({ type: "meta", data: requestJson });

			return meta;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async findAll() {
		const metas = await this.ctx.model.Meta.find();
		if (!metas) {
			return undefined;
		}

		// Parse the previous to string[]
		for (let i = 0; i < metas.length; i += 1) {
			metas[i].previousTxns = strToStrArray(metas[i].previousTxns);
		}
		return metas;
	}
}

module.exports = MetaService;
