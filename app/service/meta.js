"use strict";

const Service = require("egg").Service;
const { strToStrArray } = require("../utils/utils");

class MetaService extends Service {
	async create(body) {
		const { name, description, projectId, previous } = body;
		try {
			const meta = await this.ctx.model.Meta.create({
				name,
				description,
				projectId: Number(projectId),
				previous,
			});
			return meta;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async findAll() {
		const metas = await this.ctx.model.Meta.findAll();
		if (!metas) {
			return undefined;
		}

		// Parse the previous to string[]
		for (let i = 0; i < metas.length; i += 1) {
			console.log(metas[i].previous);
			metas[i].previous = strToStrArray(metas[i].previous);
		}
		return metas;
	}
}

module.exports = MetaService;
