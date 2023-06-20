"use strict";

const Service = require("egg").Service;
const { registerUser } = require("../blockchain/utils");
const { randomString } = require("../utils/utils");


class RegisterService extends Service {


    async register(org){
		
        try{
            
            //const walletId = randomString(128);
            const walletId = Date.now().toString();
            registerUser(org,walletId);

            return walletId;

        } catch (error){
            console.error(error);
			return undefined;
        }
		
    }   
}

module.exports = RegisterService;
