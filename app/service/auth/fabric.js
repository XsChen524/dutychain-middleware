"use strict";

const path = require("path");
const fs = require("fs");
const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const { buildCCPOrg, buildWallet } = require("../../blockchain/AppUtil");
const { buildCAClient, registerAndEnrollUser } = require("../../blockchain/CAUtil");
const Service = require("egg").Service;

const BASE_DIR = process.cwd();

class FabricService extends Service {
	/**
	 *	Register user
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

			const ccp = await buildCCPOrg(ccpPath);
			const wallet = await buildWallet(Wallets, walletPath);
			const caClient = await buildCAClient(FabricCAServices, ccp, ca);
			await registerAndEnrollUser(caClient, wallet, orgMSP, walletId, department);

			return walletId;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

module.exports = FabricService;
