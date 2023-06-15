"use strict";

const Service = require("egg").Service;
// const Sequelize = require("sequelize");
// const { randomString } = require("../utils/utils");
// const { init, createAsset, readAsset, readRange, transfer, execQuery, execQueryWithPage } = require("../blockchain/utils");

const { init, createAsset, readAsset, readRange } = require("../blockchain/utils");
const { randomString } = require("../utils/utils");

class DebugService extends Service {

    async create(body) {
        /**
         * @param {String} vendorId Get string from request body,
         * need stringfying at frontend.
         */
        const { type, id, data } = body;
        // throw new Error('Ledger create asset failed. ');
        const res = createAsset(id, type, JSON.stringify(data));
        return res;
    }

    async readAll() {
        try {
            const res = await readRange();
            return JSON.parse(res);
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async read(body) {
        const { id } = body;
        try {
            if (id === undefined) {
                console.log("ID cannot be empty");
                throw new Error("ID cannot be empty");
            }
            const res = readAsset(id);
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
            return error;
        }
    }
}

module.exports = DebugService;
