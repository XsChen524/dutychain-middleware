"use strict";


const Service = require("egg").Service;
const crypto = require('crypto');
// const Sequelize = require("sequelize");

const { init, createAsset, readAsset, readRange, debugReadAll} = require("../blockchain/utils");
const { randomString } = require("../utils/utils");

class DebugService extends Service {

    async create(body) {
        /**
         * @param {String} vendorId Get string from request body,
         * need stringfying at frontend.
         */

        const {type, id, data, walletId, org} = body

        //const wallet = await this.ctx.service.wallet.getWallet(userId);
        const res = createAsset(id, type, JSON.stringify(data), walletId.toString(), org);
        return res;
    }

    async readAll(body) {
        try {

            const { walletId, org } = body;
            const res = await readRange('','', walletId.toString(), org);
            return JSON.parse(res);
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async read(body) {
        const { id, walletId, org } = body;
        try {
            if (id === undefined) {
                console.log("ID cannot be empty");
                throw new Error("ID cannot be empty");
            }
            const res = readAsset(id, walletId.toString(), org);
            return res;
        } catch (error) {
            console.error(error);
            return error;
        }

    }

    async init() {
        try {
            init();
            return "init success";
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async debugReadAll() {
        try {
            const res = await debugReadAll('','');
            return JSON.parse(res);
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }    
}

module.exports = DebugService;
