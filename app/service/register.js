"use strict";

const Service = require("egg").Service;

class RegisterService extends Service {


    async register(){
		
        try{
            const {walletId, walletPath} = await this.ctx.service.wallet.createIdentity();
            console.log("walletId:",walletId);
            console.log("walletPath:",walletPath);

            // enroll user
            await this.ctx.service.wallet.enrollIdentity(walletPath, walletId);

            return walletId;

        } catch (error){
            console.error(error);
			return undefined;
        }
		
    }   
}

module.exports = RegisterService;
