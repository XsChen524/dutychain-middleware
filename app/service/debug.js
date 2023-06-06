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
		const { id, title, data, vendorId } = body;
		try {
            if(id === undefined){
                console.log("ID cannot be empty");
                throw new Error("ID cannot be empty");
            }
            const res = createAsset(id,title,data,vendorId);            
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

            const res = readAsset(body.id);
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
