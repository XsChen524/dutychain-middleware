"use strict";

const path = require("path");
const Service = require("egg").Service;
const { Gateway, Wallets } = require("fabric-network");
const { buildCCPOrg, buildWallet } = require("../../blockchain/AppUtil");

/**
 * Constants
 * @constant
 */
const BASE_DIR = process.cwd();
const CHANNEL_NAME = "mychannel";
const CHAINCODE_NAME = "ledger";

class DocumentService extends Service {
	async findAllDocuments(left = "", right = "", walletId, orgId) {
		const orgMSP = `Org${orgId}MSP`;
		const ccpPath = path.resolve(`${BASE_DIR}/app/ccp/connection-org${orgId}.json`);
		const walletPath = path.resolve(`${BASE_DIR}/app/blockchain/wallet/${orgMSP}`);

		try {
			const ccp = buildCCPOrg(ccpPath);
			const wallet = await buildWallet(Wallets, walletPath);
			const gateway = new Gateway();
			await gateway.connect(ccp, {
				wallet,
				identity: walletId,
				discovery: { enabled: true, asLocalhost: false }, // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(CHANNEL_NAME);
			// Get the contract from the network.
			const contract = network.getContract(CHAINCODE_NAME);
			console.log(
				`\n--> Evaluate Transaction: GetAssetsByRange, function
				use an open start and open end range to return assest1 to asset6`
			);
			const result = await contract.evaluateTransaction("GetAssetsByRange", left, right);
			gateway.disconnect();
			return JSON.parse(result);
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}
}

module.exports = DocumentService;
