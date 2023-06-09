"use strict";

const Service = require("egg").Service;

class VendorService extends Service {
	async create(body) {
		const { name, description, role } = body;
		let previousId = (await this.ctx.model.Meta.find().sort({ id: -1 }))[0];
		previousId = previousId === undefined ? 0 : previousId.id;
		try {
			const vendor = await this.ctx.model.Vendor.insertMany([{
				id: previousId + 1,
				name,
				description,
				role,
			}]);

			const str = JSON.stringify({ id, name, description, role });
			const hash = crypto.createHmac('sha256', '123456')
				.update(str, 'utf8')
				.digest('hex');
			const requestJson = { id, hash };
			this.ctx.service.debug.create({ type: "vendor", data: requestJson });

			return vendor;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async findAll() {
		const vendors = await this.ctx.model.Vendor.find();
		if (!vendors) {
			return undefined;
		}
		return vendors;
	}
}

module.exports = VendorService;
