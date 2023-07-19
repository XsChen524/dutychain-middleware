"use strict";

const crypto = require("crypto");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");
const { Wallets, Gateway } = require("fabric-network");
const { randomString, hash } = require("../../utils/utils");

const Service = require("egg").Service;

/**
 * @constant
 */
const BASE_DIR = process.cwd();
const ADMIN_INFO_PATH = path.resolve(`${BASE_DIR}/app/blockchain/adminInfo.json`);
const PUB_KEY_CONFIG_PATH = path.resolve(`${BASE_DIR}/app/pubKeys/config.json`);
const CHANNEL_NAME = "mychannel";
const CHAIN_CODE_NAME = "ledger";

class FabricService extends Service {
	/**
	 * Create an asset on the ledger
	 * @param {string} id the primary key in blockchain
	 * @param {string} type the document type
	 * @param {string} data the data in blockchain, need stringfying at frontend.
	 * @param {number} walletId the identity used to add data in blockchain
	 * @param {string | number} orgId the org used to add data in blockchain
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
			const result = await contract.submitTransaction("CreateAsset", id, type, data);
			console.log("*** Result: committed");
			return result;
		} catch (err) {
			console.error(err);
			return undefined;
		} finally {
			gateway.disconnect();
		}
	}

	/**
	 * initialize the network
	 * @return {string} password
	 */
	async initialize() {
		try {
			const adminInfoExists = fs.existsSync(ADMIN_INFO_PATH);
			if (adminInfoExists) {
				const adminInfo = fs.readFileSync(ADMIN_INFO_PATH, "utf8");
				return JSON.parse(adminInfo);
			}

			let configContent;
			const pubKeyConfigExists = fs.existsSync(PUB_KEY_CONFIG_PATH);
			if (pubKeyConfigExists) {
				configContent = fs.readFileSync(PUB_KEY_CONFIG_PATH, "utf8");
			} else {
				throw new Error("No PubKey Config");
			}

			const pubKeys = JSON.parse(configContent);
			const encrypted_passwords = {};

			for (let i = 0; i < pubKeys.length; i++) {
				const orgId = pubKeys[i].NAME;
				const orgMSP = `Org${orgId}MSP`;
				const password = randomString(8);

				const ccpPath = path.resolve(`${BASE_DIR}/app/ccp/connection-org${orgId}.json`);
				const walletPathOrg = path.resolve(`${BASE_DIR}/app/blockchain/wallet/${orgMSP}`);
				const pubKeyPath = path.resolve(`${BASE_DIR}/app/pubKeys/${pubKeys[i].PUBKEY_PATH}`);

				const pubKey = fs.readFileSync(pubKeyPath, "utf-8");
				console.log(pubKey);

				const ccp = await this.ctx.service.fabric.app.buildCCPOrg(ccpPath);

				const caClientOrg = await this.ctx.service.fabric.ca.buildCAClient(
					FabricCAServices,
					ccp,
					`ca.org${orgId}.example.com`
				);

				const wallet = await this.ctx.service.fabric.app.buildWallet(Wallets, walletPathOrg);

				await this.ctx.service.fabric.ca.enrollAdmin(caClientOrg, wallet, orgMSP);

				const encrypted = crypto.publicEncrypt(pubKey, Buffer.from(password, "utf-8"));

				encrypted_passwords[orgId] = encrypted.toString("hex");

				const identity = await wallet.get("admin");
				console.log(identity);

				const wallethash = hash(JSON.stringify(identity));

				const data = JSON.stringify({
					org: orgId.toString(),
					walletHash: wallethash,
				});

				await this.createAsset(randomString(12), "admin", data, "admin", orgId);
			}

			fs.writeFileSync(ADMIN_INFO_PATH, JSON.stringify(encrypted_passwords));
			return encrypted_passwords;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Register user
	 * @param {Number} organizationId organizationID
	 * @return {String} walletId
	 */
	async registerInOrganization(organizationId) {
		// Assign current timestmap to user as its walletId
		const walletId = Date.now().toString();
		const orgIdStr = organizationId.toString();
		try {
			// Declare namespace and path
			const orgMSP = `Org${orgIdStr}MSP`;
			const ca = `ca.org${orgIdStr}.example.com`;
			const department = `org${orgIdStr}.department1`;
			const ccpPath = path.resolve(`${BASE_DIR}/app/ccp/connection-org${orgIdStr}.json`);
			const walletPath = path.resolve(`${BASE_DIR}/app/blockchain/wallet/${orgMSP}`);

			const ccp = await this.ctx.service.fabric.app.buildCCPOrg(ccpPath);
			const wallet = await this.ctx.service.fabric.app.buildWallet(Wallets, walletPath);
			const caClient = await this.ctx.service.fabric.ca.buildCAClient(FabricCAServices, ccp, ca);
			await this.ctx.service.fabric.ca.registerAndEnrollUser(caClient, wallet, orgMSP, walletId, department);

			const data = JSON.stringify({
				description: `Create new user in organization ${organizationId}`,
			});

			await this.createAsset(randomString(12), "user", data, walletId, organizationId);
			return walletId;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

module.exports = FabricService;
