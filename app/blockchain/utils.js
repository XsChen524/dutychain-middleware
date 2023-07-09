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

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities, with the state database using couchdb
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca -s couchdb
// - Use any of the asset-transfer-ledger-queries chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "ledger". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
	2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
	******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-ledger-queries/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show ledger queries operations with any of the asset-transfer-ledger-queries chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */


async function registerUser(OrgName, walletId){

	try{
		
		const OrgMSP = 'Org'+OrgName+'MSP'
		const ccpPath = path.resolve(__dirname, '..', 'ccp', 'connection-org'+OrgName+'.json');
		const ccp = buildCCPOrg(ccpPath);
		const ca = 'ca.org'+OrgName+'.example.com';
		const department = 'org'+OrgName+'.department1';

		const walletPath = path.join(__dirname, 'wallet', OrgMSP);
		const wallet = await buildWallet(Wallets, walletPath);
		const caClient = buildCAClient(FabricCAServices, ccp, ca);
		await registerAndEnrollUser(caClient, wallet, OrgMSP, walletId, department);
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
			const OrgEmail = 'org'+OrgName+'.example.com'
			const username = 'Org' + OrgName + 'Admin'
			const password = randomString(8);
			const ccpPath = path.resolve(__dirname, '..', 'ccp', 'connection-org'+OrgName+'.json');
			//const ccpPath = path.resolve(__dirname, '..', '..','hyperledger','test-network', 'organizations', 'peerOrganizations', OrgEmail, 'connection-org'+OrgName+'.json');
			const pubKeyPath = path.resolve(__dirname, '..','pubKeys',configJSON[i].PUBKEY_PATH);
			const pubKey = fs.readFileSync(pubKeyPath,'utf-8')

			//const privKeyPath = path.resolve(__dirname, '..',configJSON[i].PRIVKEY_PATH);
			//const privKey = fs.readFileSync(privKeyPath,'utf-8')

			const ccp = buildCCPOrg(ccpPath);
			const caClientOrg = buildCAClient(FabricCAServices, ccp, 'ca.org'+OrgName+'.example.com');
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
				email:OrgEmail,
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
		throw error;
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
		throw error;
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



/*
async function transfer(id, newVendorId, ccp, wallet) {
	try {
		const gateway = new Gateway();
		//const wallet = await buildWallet(Wallets, walletPath);
		//const ccp = buildCCPOrg1();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: userId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			try {
				console.log('\n--> Submit Transaction: TransferAsset, transfer asset(asset2) to new owner(Max)');
				await contract.submitTransaction('TransferAsset', id, newVendorId);
				console.log('*** Result: committed');
				return true;
			} catch (error) {
				console.log(`Error: \n    ${error}`);
				return false;
			}
		} finally {
			gateway.disconnect();
		}

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		throw error;
	}
}
*/
/*
async function execQuery(query) {
	try {
		const gateway = new Gateway();
		const wallet = await buildWallet(Wallets, walletPath);
		const ccp = buildCCPOrg1();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: userId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			try {
				console.log('\n--> Evaluate Transaction: QueryAssets', JSON.stringify(query));
				let result = await contract.evaluateTransaction('QueryAssets', JSON.stringify(query));
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
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
		throw error;
	}
}
*/
/*
async function execQueryWithPage(query, pageSize, bookmark) {
	try {
		const gateway = new Gateway();
		const wallet = await buildWallet(Wallets, walletPath);
		const ccp = buildCCPOrg1();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: userId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			try {
				console.log('\n--> Evaluate Transaction: QueryAssets', JSON.stringify(query));
				let result = await contract.evaluateTransaction('QueryAssets', JSON.stringify(query), pageSize, bookmark);
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
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
		throw error;
	}
}
*/
module.exports = { init, createAsset, readAsset, readRange, registerUser};
//module.exports = { init, createAsset, readAsset, readRange, transfer, execQuery, execQueryWithPage };
