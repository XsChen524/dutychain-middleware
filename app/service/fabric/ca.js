"use strict";

const Service = require("egg").Service;

/**
 * @constant
 */
const ADMIN_USER_ID = "admin";
const ADMIN_USER_PASSWORD = "adminpw";

class CaService extends Service {
	async buildCAClient(FabricCAServices, ccp, caHostName) {
		// Create a new CA client for interacting with the CA.
		const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
		const caTLSCACerts = caInfo.tlsCACerts.pem;
		const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

		console.log(`Built a CA Client named ${caInfo.caName}`);
		return caClient;
	}

	async enrollAdmin(caClient, wallet, orgMspId) {
		try {
			// Check to see if we've already enrolled the admin user.
			const identity = await wallet.get(ADMIN_USER_ID);
			if (identity) {
				console.log("An identity for the admin user already exists in the wallet");
				return;
			}

			// Enroll the admin user, and import the new identity into the wallet.
			const enrollment = await caClient.enroll({
				enrollmentID: ADMIN_USER_ID,
				enrollmentSecret: ADMIN_USER_PASSWORD,
			});
			const x509Identity = {
				credentials: {
					certificate: enrollment.certificate,
					privateKey: enrollment.key.toBytes(),
				},
				mspId: orgMspId,
				type: "X.509",
			};
			await wallet.put(ADMIN_USER_ID, x509Identity);
			console.log("Successfully enrolled admin user and imported it into the wallet");
		} catch (error) {
			console.error(`Failed to enroll admin user : ${error}`);
		}
	}

	async registerAndEnrollUser(caClient, wallet, orgMspId, userId, affiliation) {
		try {
			// Check to see if we've already enrolled the user
			const userIdentity = await wallet.get(userId);
			if (userIdentity) {
				console.log(`An identity for the user ${userId} already exists in the wallet`);
				return;
			}

			// Must use an admin to register a new user
			const adminIdentity = await wallet.get(ADMIN_USER_ID);
			if (!adminIdentity) {
				console.log("An identity for the admin user does not exist in the wallet");
				console.log("Enroll the admin user before retrying");
				return;
			}

			// build a user object for authenticating with the CA
			const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
			const adminUser = await provider.getUserContext(adminIdentity, ADMIN_USER_ID);

			// Register the user, enroll the user, and import the new identity into the wallet.
			// if affiliation is specified by client, the affiliation value must be configured in CA
			const secret = await caClient.register(
				{
					affiliation,
					enrollmentID: userId,
					role: "client",
				},
				adminUser
			);
			const enrollment = await caClient.enroll({
				enrollmentID: userId,
				enrollmentSecret: secret,
			});
			const x509Identity = {
				credentials: {
					certificate: enrollment.certificate,
					privateKey: enrollment.key.toBytes(),
				},
				mspId: orgMspId,
				type: "X.509",
			};
			await wallet.put(userId, x509Identity);
			console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
		} catch (error) {
			console.error(`Failed to register user : ${error}`);
		}
	}
}

module.exports = CaService;
