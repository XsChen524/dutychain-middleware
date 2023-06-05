"use strict";

const Service = require("egg").Service;
const Sequelize = require("sequelize");
const { randomString } = require("../utils/utils");
const { init, createAsset, readAsset, readRange, transfer, execQuery, execQueryWithPage } = require("../blockchain/utils");


class DebugService extends Service {


	async create(body) {
		/**
		 * @param {String} vendorId Get string from request body,
		 * need stringfying at frontend.
		 */
		const { type, operatorId, description, fromVendor, toVendor } = body;
		try {
			// const txn = await this.ctx.model.Txn.create({
			// 	id:
			// 		"0x000000000000000000000000000000000000000000000000" +
			// 		randomString(16),
			// 	blockId: 1,
			// 	type,
			// 	operatorId: Number(operatorId),
			// 	description,
			// 	fromVendor: Number(fromVendor),
			// 	toVendor: Number(toVendor),
			// 	createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
			// 	committedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
			// });

            const inputBody = {
                ID: "4",
                Color: "Blue",
                Size: 5,
                Owner: 'Tom',
                AppraisedValue: 300
            };

            const res = createAsset(inputBody.ID,inputBody.Color,inputBody.Size,inputBody.Owner,inputBody.AppraisedValue);            
			return res;

		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async readAll() {
        try{
            const res = readRange();
            return res;
        } catch(error){
            console.error(error);
			return undefined;
        }
	}

    async read(body) {
        try{

            const inputBody = {
                ID:"asset7"
            };

            const res = readAsset(inputBody.ID);
            return res;
        } catch(error){
            console.error(error);
			return error;
        }
		
	}

    async init() {
        try{
            init();
            return "init success";
        } catch(error){
            console.error(error);
			return error;
        }
	}
}

module.exports = DebugService;
