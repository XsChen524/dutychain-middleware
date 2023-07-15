/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg, buildWallet } = require('./AppUtil.js');
const { randomString, hash } = require("../utils/utils");
const channelName = 'mychannel';
const chaincodeName = 'ledger';


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function registerUser(OrgName, walletId){

	try{
		const configPath = path.resolve(__dirname, '..', 'pubKeys','config.json');
		const fileExists = fs.existsSync(configPath);
		if (!fileExists) {
			throw new Error(`no such file or directory: ${configPath}`);
		}
		const configContent = fs.readFileSync(configPath, 'utf8');
		// build a JSON object from the file contents
		const configJSON = JSON.parse(configContent);
		const length = configJSON.length;
		let Domain = "org."+OrgName+".example.com"
		for(var i = 0; i<length; i++){
			if (configJSON[i].NAME === OrgName){
				Domain = configJSON[i].DOMAIN
				break;
			}
		}
		
		const OrgMSP = 'Org'+OrgName+'MSP'
		const ccpPath = path.resolve(__dirname, '..', 'ccp', 'connection-org'+OrgName+'.json');
		const ccp = buildCCPOrg(ccpPath);
		const ca = 'ca.'+Domain;
		//const department = 'org'+OrgName+'.department1';

		const walletPath = path.join(__dirname, 'wallet', OrgMSP);
		const wallet = await buildWallet(Wallets, walletPath);
		const caClient = buildCAClient(FabricCAServices, ccp, ca);
		await registerAndEnrollUser(caClient, wallet, OrgMSP, walletId);
	} catch(error){
		console.error(error);
		throw error;
	}
	
}


async function init(ctx) {


	try {
		let adminInfoPath = path.resolve(__dirname, 'adminInfo.json');
		let fileExists = fs.existsSync(adminInfoPath);
		if (fileExists) {
			console.log("already initialized");
			return fs.readFileSync(adminInfoPath, 'utf8');
		}

		const configPath = path.resolve(__dirname, '..', 'pubKeys','config.json');
		fileExists = fs.existsSync(configPath);
		if (!fileExists) {
			throw new Error(`no such file or directory: ${configPath}`);
		}
		const configContent = fs.readFileSync(configPath, 'utf8');

		// build a JSON object from the file contents
		const configJSON = JSON.parse(configContent);
		const length = configJSON.length;
		let encrypted_passwords = {}
		for(var i = 0; i<length; i++){
			const OrgName = configJSON[i].NAME
			const OrgMSP = 'Org'+OrgName+'MSP'
			const Domain = configJSON[i].DOMAIN
			
			console.log("=======================================================")
			console.log("Domain:",Domain)
			console.log("=======================================================")
			const username = 'Org' + OrgName + 'Admin'
			const password = randomString(8);
			const ccpPath = path.resolve(__dirname, '..', 'ccp', 'connection-org'+OrgName+'.json');
			const pubKeyPath = path.resolve(__dirname, '..','pubKeys',configJSON[i].PUBKEY_PATH);
			const pubKey = fs.readFileSync(pubKeyPath,'utf-8')

			//const privKeyPath = path.resolve(__dirname, '..',configJSON[i].PRIVKEY_PATH);
			//const privKey = fs.readFileSync(privKeyPath,'utf-8')

			const ccp = buildCCPOrg(ccpPath);
			const caClientOrg = buildCAClient(FabricCAServices, ccp, 'ca.'+Domain);
			console.log("=======================================================")
			console.log("ccp:",ccp)
			console.log("=======================================================")
			const walletPathOrg = path.join(__dirname, 'wallet', OrgMSP);
			console.log("=======================================================")
			console.log("walletPathOrg:",walletPathOrg)
			console.log("=======================================================")
			const wallet = await buildWallet(Wallets, walletPathOrg);

			console.log("Enrolling:",OrgName);
			await enrollAdmin(caClientOrg, wallet, OrgMSP);

			let previousId = (
				await ctx.model.Auth.User.find().sort({ id: -1 })
			)[0];
			previousId = previousId === undefined ? 0 : previousId.id;
			const user = await ctx.model.Auth.User.create({
				id: previousId + 1,
				email:Domain,
				name:username,
				password:hash(password),		
				organization:OrgName,
				role:"admin",
				isAdmin:true,
				walletId:"admin",
			});
			console.log(password)
			
			let encrypted = crypto.publicEncrypt(pubKey, Buffer.from(password, 'utf-8'))
			encrypted_passwords[OrgName] = encrypted.toString('hex');

			// Error data longer than mod means type error
			//let decrypted = crypto.privateDecrypt(privKey,encrypted).toString('utf-8');
			//console.log(decrypted)
			
			//encrypted_passwords[OrgName] = password;
			
			const identity = await wallet.get("admin");
			const wallethash = hash(JSON.stringify(identity));
			console.log("identity=======================================================")
			console.log(identity);
			console.log("hash=======================================================")		
			console.log(wallethash);
			console.log("=======================================================")
			const gateway = new Gateway();
			const data = JSON.stringify({
				org: OrgName.toString(),
				walletHash: wallethash
			})
			try {
				await gateway.connect(ccp, {
					wallet,
					identity: "admin",
					discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);
				try {
					console.log('\n--> Submit Transaction: CreateAsset');
					let result = await contract.submitTransaction('CreateAsset', i.toString(), "admin", data);
					console.log('*** Result: committed');

					// console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
					// let result = await contract.submitTransaction('CreateAsset', ID, JSON.stringify(data));
					// console.log('*** Result: committed');
					if (`${result}` !== '') {
						console.log(`*** Result: ${prettyJSONString(result)}`);
					}

				} catch (error) {
					console.log(`Error: \n    ${error}`);
					throw error;
				}


			} finally {
				gateway.disconnect();
			}
		}

		adminInfoPath = path.resolve(__dirname, 'adminInfo.json');
		fs.writeFileSync(adminInfoPath, JSON.stringify(encrypted_passwords));

		console.log('*** init ends');

		return JSON.stringify(encrypted_passwords);


	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		throw error;
	}


	
}




async function createAsset(id, type, data, walletId, OrgName) {
	/**
     * @param {String} id the primary key in blockchain
	 * @param {String} type the document type
	 * @param {String} data the data in blockchain, need stringfying at frontend.
	 * @param {Number} walletId the identity used to add data in blockchain
     * @param {String} OrgName the org used to add data in blockchain
    */
	try {
		const OrgMSP = 'Org'+OrgName+'MSP'
		const ccpPath = path.resolve(__dirname, '..', 'ccp', 'connection-org'+OrgName+'.json');
		const ccp = buildCCPOrg(ccpPath);

		const walletPath = path.join(__dirname, 'wallet', OrgMSP);
		const wallet = await buildWallet(Wallets, walletPath);


		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: walletId,
				discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
			try {
				console.log('\n--> Submit Transaction: CreateAsset');
				let result = await contract.submitTransaction('CreateAsset', id, type, data);
				console.log('*** Result: committed');

				// console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
				// let result = await contract.submitTransaction('CreateAsset', ID, JSON.stringify(data));
				// console.log('*** Result: committed');
				if (`${result}` !== '') {
					console.log(`*** Result: ${prettyJSONString(result)}`);
				}
				return result;

			} catch (error) {
				console.log(`Error: \n    ${error}`);
				throw error;
			}


		} finally {
			gateway.disconnect();
		}


	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		return `${error}`;
	}
}



async function readAsset(id, walletId, OrgName) {
	try {
		const OrgMSP = 'Org'+OrgName+'MSP'
		const ccpPath = path.resolve(__dirname, '..', 'ccp', 'connection-org'+OrgName+'.json');
		const ccp = buildCCPOrg(ccpPath);

		const walletPath = path.join(__dirname, 'wallet', OrgMSP);
		const wallet = await buildWallet(Wallets, walletPath);

		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: walletId,
				discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
			try {
				console.log('\n--> Evaluate Transaction: ReadAsset');
				let result = await contract.evaluateTransaction('ReadAsset', id);
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
				return result;

			} catch (error) {
				console.log(`Error: \n    ${error}`);
				return {};
			}

		} finally {
			gateway.disconnect();
		}


	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		return `${error}`;
	}
}



async function readRange(left = '', right = '', walletId, OrgName) {
	try {
		
		const OrgMSP = 'Org'+OrgName+'MSP'
		const ccpPath = path.resolve(__dirname, '..', 'ccp', 'connection-org'+OrgName+'.json');
		const ccp = buildCCPOrg(ccpPath);

		const walletPath = path.join(__dirname, 'wallet', OrgMSP);
		const wallet = await buildWallet(Wallets, walletPath);

		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: walletId,
				discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			try {
				console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and open end range to return assest1 to asset6');
				let result = await contract.evaluateTransaction('GetAssetsByRange', left, right);
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
				return result;
			} catch (error) {
				console.log(`Error: \n    ${error}`);
				return error;
			}
		} finally {
			gateway.disconnect();
		}

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		return `${error}`;
	}
}




module.exports = { init, createAsset, readAsset, readRange, registerUser};
