"use strict";

const Service = require("egg").Service;
// const Sequelize = require("sequelize");

const { createWallet, enroll} = require("../blockchain/utils");
const { randomString } = require("../utils/utils");

class WalletService extends Service {

    async createIdentity(){
        
        //=========================================================================================
        // auto increment of wallet id
        let counter_val = await this.ctx.model.WalletIdCounter.findOneAndUpdate(
            {id:"autoval"},
            {"$inc":{"seq":1}},
            {new: true}
        )

        let walletId;
        if(!counter_val){
            const val = new this.ctx.model.WalletIdCounter({
                id:"autoval",
                seq:1
            })
            val.save();
            walletId = 1;
        }
        else{
            walletId = counter_val.seq;
        }

        //=========================================================================================

        const walletPath = await createWallet(walletId);


        const wallet_data = new this.ctx.model.Wallet({
            walletId: Number(walletId),
			wallet: walletPath,
        });
        wallet_data.save();

		
		return {walletId, walletPath};
    }


    async enrollIdentity(walletPath, walletId){
        await enroll(walletPath,walletId);
    }


    async getIdentity(walletId){

        this.ctx.model.Wallet.findOne({walletId:walletId})
        .then((data)=>{
            if(!data){
                return undefined;
            }
            console.log("wallet data:",data);
            const walletPath = data.wallet;
            console.log("walletPath:",walletPath);
            return walletPath;
        })
        .catch((err)=>{
            console.err(err);
            throw err;
        });
    }
}

module.exports = WalletService;
