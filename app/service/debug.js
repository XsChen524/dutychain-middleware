"use strict";


const Service = require("egg").Service;
// const crypto = require('crypto');

// const { Gateway, Wallets } = require('fabric-network');
// const FabricCAServices = require('fabric-ca-client');
// // const eccrypto = require('eccrypto');
// const path = require('path');
// const fs = require('fs');

// const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../blockchain/CAUtil.js');
// const { buildCCPOrg, buildWallet } = require('../blockchain/AppUtil.js');
// const { randomString, hash } = require("../utils/utils");
// const channelName = 'mychannel';
// const chaincodeName = 'ledger';
// const Sequelize = require("sequelize");

const { init, createAsset, readAsset, readRange} = require("../blockchain/utils");
//const { randomString } = require("../utils/utils");

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

    // async init() {
    //     try {
    //         let adminInfoPath = path.resolve(__dirname, '..','adminInfo.json');
    //         let fileExists = fs.existsSync(adminInfoPath);
    //         if (fileExists) {
    //             return fs.readFileSync(adminInfoPath, 'utf8');
    //         }
    
    //         const configPath = path.resolve(__dirname, '..' ,'config.json');
    //         fileExists = fs.existsSync(configPath);
    //         if (!fileExists) {
    //             throw new Error(`no such file or directory: ${configPath}`);
    //         }
    //         const configContent = fs.readFileSync(configPath, 'utf8');
    
    //         // build a JSON object from the file contents
    //         const configJSON = JSON.parse(configContent);
    //         const length = configJSON.length;
    //         let encrypted_passwords = {}
    //         for(var i = 0; i<length; i++){
    //             const OrgName = configJSON[i].NAME
    //             const OrgMSP = 'Org'+OrgName+'MSP'
    //             const OrgEmail = 'org'+OrgName+'.example.com'
    //             const username = 'Org' + OrgName + 'Admin'
    //             const password = randomString(16);
    //             const ccpPath = path.resolve(__dirname, '..', '..','hyperledger','test-network', 'organizations', 'peerOrganizations', OrgEmail, 'connection-org'+OrgName+'.json');
                
    //             const ccp = buildCCPOrg(ccpPath);
    //             const caClientOrg = buildCAClient(FabricCAServices, ccp, 'ca.org'+OrgName+'.example.com');
    
    //             const walletPathOrg = path.join(__dirname, '..', 'wallet', OrgMSP);
    //             console.log("=======================================================")
    //             console.log("walletPathOrg:",walletPathOrg)
    //             console.log("=======================================================")
    //             const wallet = await buildWallet(Wallets, walletPathOrg);
    
    //             console.log("Enrolling:",OrgName);
    //             await enrollAdmin(caClientOrg, wallet, OrgMSP);
    
    //             let previousId = (
    //                 await this.ctx.model.Auth.User.find().sort({ id: -1 })
    //             )[0];
    //             previousId = previousId === undefined ? 0 : previousId.id;
    //             const user = await this.ctx.model.Auth.User.create({
    //                 id: previousId + 1,
    //                 email:OrgEmail,
    //                 name:username,
    //                 password:hash(password),		
    //                 organization:OrgName,
    //                 role:"admin",
    //                 isAdmin:true,
    //                 walletId:"admin",
    //             });
    
        
    //             //encrypted_passwords[OrgName] = await eccrypto.encrypt(configJSON[i].pubKey, Buffer.from(password))
    //             encrypted_passwords[OrgName] = password;
    //         }
    
    //         adminInfoPath = path.resolve(__dirname, '..','adminInfo.json');
    //         fs.writeFileSync(adminInfoPath, JSON.stringify(encrypted_passwords));
    
    //         console.log('*** init ends');
    
    //         return JSON.stringify(encrypted_passwords);
    
    
    //     } catch (error) {
    //         //console.error(`******** FAILED to run the application: ${error}`);
    //         console.error(`******** FAILED to run the application`);
    //         throw error;
    //     }
    // }

    async init() {
        try {
            const res = await init(this.ctx);
            return res
            //return "init success";
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
