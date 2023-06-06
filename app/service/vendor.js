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
