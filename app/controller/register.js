"use strict";

const { init, createAsset, readAsset, readRange, createWallet, enroll, debugReadAll} = require("../blockchain/utils");

const Controller = require("egg").Controller;

class RegisterController extends Controller {
	async index() {
		const { ctx } = this;
		ctx.body = 'hi, registrator';
	}

	async register(){
        const { ctx } = this;
		const {org} = ctx.request.body;
		const res = await ctx.service.register.register(org);
		if (!res) {
			ctx.status = 406;
			ctx.body = undefined;
			return;
		}
		ctx.status = 201;
		ctx.body = res;
		return;
    }

}

module.exports = RegisterController;
