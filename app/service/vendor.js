"use strict";

const Service = require("egg").Service;

class VendorService extends Service {
	async create(body) {
		const { id, name, description, role } = body;
		try {
			const vendor = await this.ctx.model.Vendor.create({
				id: Number(id),
				name,
				description,
				role,
			});
			return vendor;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async findAll() {
		const vendors = await this.ctx.model.Vendor.findAll();
		if (!vendors) {
			return undefined;
		}
		return vendors;
	}
}

module.exports = VendorService;
