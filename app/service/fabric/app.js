"use strict";

const fs = require("fs");
const Service = require("egg").Service;

class AppService extends Service {
	async buildCCPOrg(ccpPath) {
		// load the common connection configuration file

		const fileExists = fs.existsSync(ccpPath);
		if (!fileExists) {
			throw new Error(`no such file or directory: ${ccpPath}`);
		}
		const contents = fs.readFileSync(ccpPath, "utf8");

		// build a JSON object from the file contents
		const ccp = JSON.parse(contents);

		console.log(`Loaded the network configuration located at ${ccpPath}`);
		return ccp;
	}

	async buildWallet(Wallets, walletPath) {
		// Create a new  wallet : Note that wallet is for managing identities.
		let wallet;
		if (walletPath) {
			wallet = await Wallets.newFileSystemWallet(walletPath);
			console.log(`Built a file system wallet at ${walletPath}`);
		} else {
			wallet = await Wallets.newInMemoryWallet();
			console.log("Built an in memory wallet");
		}
		return wallet;
	}
}

module.exports = AppService;
