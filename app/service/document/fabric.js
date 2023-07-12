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

class FabricService extends Service {
	async index() {}
}

module.exports = FabricService;
