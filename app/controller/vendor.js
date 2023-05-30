"use strict";

const Controller = require("egg").Controller;

class VendorController extends Controller {
	async createVendor() {
		const { ctx } = this;
		const vendor = await ctx.service.vendor.create(ctx.request.body);
		if (!vendor) {
			ctx.status = 406;
			ctx.body = {
				success: false,
				data: undefined,
			};
			return;
		}
		ctx.status = 201;
		ctx.body = {
			success: true,
			data: vendor,
		};
		return;
	}

	async getAllVendors() {
		const ctx = this.ctx;
		const vendors = await ctx.service.vendor.findAll();
		if (vendors) {
			ctx.status = 200;
			ctx.body = {
				success: true,
				data: vendors,
			};
		} else {
			ctx.status = 400;
			ctx.body = {
				success: false,
				data: undefined,
			};
		}
		return;
	}
}

module.exports = VendorController;
