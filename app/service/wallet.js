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
        //const wallet_string = JSON.stringify(wallet);
        //console.log("wallet:",wallet);
        //console.log("wallet string",wallet_string);


        const wallet_data = new this.ctx.model.Wallet({
            walletId: Number(walletId),
			wallet: walletPath,
        });
        wallet_data.save();

		
		return {walletId, walletPath};
    }


    async bindIdentity(userId, walletId){
        // await this.ctx.model.Identity.create({
		// 	userId: Number(userId),
		// 	walletId: Number(walletId),
		// });

        const data = new this.ctx.model.UserWallet({
			userId: userId,
			walletId: walletId,
		});
        data.save();
    }

    async enrollIdentity(walletPath, walletId){
        await enroll(walletPath,walletId);
    }


    async enrollUser(userId){
        const walletPath = await this.getIdentity(userId);
        await enroll(walletPath);
    }


    async getIdentity(userId){

        this.ctx.model.UserWallet.find({userId:1}, function(err, data){
            if(err){
                console.err(err);
                throw err;
            }

            console.log("identity_data:",data);
            if(!data){
                return undefined;
            }

            const walletId = data[0].walletId;
            console.log("walletId:",walletId);

            // this.ctx.model.Wallet.find({walletId:walletId},function(err,data){
            //     if(err){
            //         console.err(err);
            //         throw err;
            //     }

            //     if(!data){
            //         return undefined;
            //     }
            //     console.log("wallet data:",data);
            //     const walletPath = data[0].wallet;
            //     console.log("walletPath:",walletPath);
            //     return walletPath;
            // });
            
        });
    }
}

module.exports = WalletService;
