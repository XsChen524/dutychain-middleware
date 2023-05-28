"use strict";

const Controller = require("egg").Controller;

class VendorController extends Controller {
	async createVendor() {
		const { ctx } = this;
		const vendor = await ctx.service.vendor.create(ctx.request.body);
		if (!vendor) {
			ctx.status = 406;
			ctx.body = undefined;
			return;
		}
		ctx.status = 201;
		ctx.body = vendor;
		return;
	}

	async getAllVendors() {
		const ctx = this.ctx;
		const vendors = await ctx.service.vendor.findAll();
		if (vendors) {
			ctx.status = 200;
		} else {
			ctx.status = 400;
		}
		ctx.body = vendors;
		return;
	}
}

module.exports = VendorController;
