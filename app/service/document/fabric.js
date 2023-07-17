"use strict";

const path = require("path");
const Service = require("egg").Service;
const { Gateway, Wallets } = require("fabric-network");

/**
 * @constant
 */
const BASE_DIR = process.cwd();
const CHANNEL_NAME = "mychannel";
const CHAIN_CODE_NAME = "ledger";

class DocumentService extends Service {
	/**
	 * Create an asset on the ledger
	 * @param {string} id the primary key in blockchain
	 * @param {string} type the document type
	 * @param {string} data the data in blockchain, need stringfying at frontend.
	 * @param {string} walletId the identity used to add data in blockchain
	 * @param {string} orgId the org used to add data in blockchain
	 */
	async createAsset(id, type, data, walletId, orgId) {
		const orgMSP = `Org${orgId}MSP`;
		const ccpPath = path.resolve(`${BASE_DIR}/app/ccp/connection-org${orgId}.json`);
		const walletPath = path.resolve(`${BASE_DIR}/app/blockchain/wallet/${orgMSP}`);
		const gateway = new Gateway();
		try {
			const ccp = await this.ctx.service.fabric.app.buildCCPOrg(ccpPath);
			const wallet = await this.ctx.service.fabric.app.buildWallet(Wallets, walletPath);

			await gateway.connect(ccp, {
				wallet,
				identity: walletId,
				discovery: { enabled: true, asLocalhost: false },
			});
			const network = await gateway.getNetwork(CHANNEL_NAME);
			const contract = network.getContract(CHAIN_CODE_NAME);
			console.log("--> Submit Transaction: CreateAsset");
			/**
			 * All arguments in submitTransaction are of type String!
			 */
			const result = await contract.submitTransaction("CreateAsset", id, type, data);
			console.log("*** Result: committed");
			return JSON.parse(result);
		} catch (err) {
			console.error(err);
			return undefined;
		} finally {
			gateway.disconnect();
		}
	}

	/**
	 * Get a specific asset
	 * @param {number} id asset id (PK)
	 * @param {string} walletId user's walletId
	 * @param {number} orgId organizationId
	 * @return {object} asset
	 */
	async readAsset(id, walletId, orgId) {
		const decoder = new TextDecoder();
		const orgMSP = `Org${orgId}MSP`;
		const ccpPath = path.resolve(`${BASE_DIR}/app/ccp/connection-org${orgId}.json`);
		const walletPath = path.resolve(`${BASE_DIR}/app/blockchain/wallet/${orgMSP}`);
		const gateway = new Gateway();

		try {
			const ccp = await this.ctx.service.fabric.app.buildCCPOrg(ccpPath);
			const wallet = await this.ctx.service.fabric.app.buildWallet(Wallets, walletPath);
			await gateway.connect(ccp, {
				wallet,
				identity: walletId,
				discovery: { enabled: true, asLocalhost: false }, // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(CHANNEL_NAME);
			const contract = network.getContract(CHAIN_CODE_NAME);
			const result = await contract.evaluateTransaction("ReadAsset", id);
			return JSON.parse(decoder.decode(result));
		} catch (err) {
			console.error(err);
			return undefined;
		} finally {
			gateway.disconnect();
		}
	}

	async readRange(left = "", right = "", walletId, orgId) {
		const decoder = new TextDecoder();
		const orgMSP = `Org${orgId}MSP`;
		const ccpPath = path.resolve(`${BASE_DIR}/app/ccp/connection-org${orgId}.json`);
		const walletPath = path.resolve(`${BASE_DIR}/app/blockchain/wallet/${orgMSP}`);
		const gateway = new Gateway();
		try {
			const ccp = await this.ctx.service.fabric.app.buildCCPOrg(ccpPath);
			const wallet = await this.ctx.service.fabric.app.buildWallet(Wallets, walletPath);

			await gateway.connect(ccp, {
				wallet,
				identity: walletId,
				discovery: { enabled: true, asLocalhost: false },
			});
			const network = await gateway.getNetwork(CHANNEL_NAME);
			const contract = network.getContract(CHAIN_CODE_NAME);
			const result = await contract.evaluateTransaction("GetAssetsByRange", left, right);
			return JSON.parse(decoder.decode(result));
		} catch (err) {
			console.error(err);
			return undefined;
		} finally {
			gateway.disconnect();
		}
	}
}

module.exports = DocumentService;
