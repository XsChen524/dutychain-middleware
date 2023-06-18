"use strict";

const Service = require("egg").Service;
//const crypto = require('crypto');
// const Sequelize = require("sequelize");

//const { init, createAsset, readAsset, readRange, createWallet, enroll, debugReadAll} = require("../blockchain/utils");
//const { randomString } = require("../utils/utils");

class RegisterService extends Service {


    async register(){
		
        try{

            // add user info to database
            //const userId = await this.ctx.service.user.createUser(body);
            //console.log("userId:",userId);

            // create a wallet and save its path to database
            const {walletId, walletPath} = await this.ctx.service.wallet.createIdentity();
            console.log("walletId:",walletId);
            console.log("walletPath:",walletPath);

            // bind user and the wallet
            //await this.ctx.service.wallet.bindIdentity(userId, walletId);

            // enroll user
            await this.ctx.service.wallet.enrollIdentity(walletPath, walletId);
            //await this.ctx.service.wallet.enrollUser(userId);

            // save user info in blockchain
            // const { name, description, role } = body;
            // const requestJson = { userId, name, description, role };
            // const type = 'user';
            // const res = await createAsset(userId.toString(), type, JSON.stringify(requestJson) ,userId, walletPath);

            return walletId;

        } catch (error){
            console.error(error);
			return undefined;
        }
		
    }   
}

module.exports = RegisterService;
