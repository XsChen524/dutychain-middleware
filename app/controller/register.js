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
		const res = await ctx.service.register.register();
		if (!res) {
			ctx.status = 406;
			ctx.body = undefined;
			return;
		}
		ctx.status = 201;
		ctx.body = res;
		return;
    }

	async getIdentity(){
		const { ctx } = this;
		const res = await ctx.service.wallet.getIdentity(1);
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
