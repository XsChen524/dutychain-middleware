"use strict";

const Service = require("egg").Service;

class AdministrationService extends Service {
	async getOrganizations() {
		try {
			const orgs = await this.ctx.model.Auth.Organization.find();
			return orgs;
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Find all users in a specific organization
	 * @param {string} orgName Organization name
	 * @return {object[]} user[]
	 */
	async findUsersByOrg(orgName) {
		try {
			let users = await this.ctx.model.Auth.User.find({
				organization: orgName,
			});

			/**
			 * Prepare users info sync
			 */
			users = await (async (users) => {
				const filteredUserArr = [];
				users.forEach((user) => {
					filteredUserArr.push({
						id: user.id,
						name: user.name,
						email: user.email,
						organization: user.organization,
						role: user.role,
						isAdmin: user.isAdmin,
					});
				});
				return filteredUserArr;
			})(users);

			return users;
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Check if the user name exists in the database
	 * @param {string} name Username
	 * @return {object} array of the users with the name
	 */
	async checkUserName(name) {
		const users = await this.ctx.model.Auth.User.find({
			attributes: ["name"],
			where: { name },
		});
		return users;
	}

	/**
	 * Rigister the user into database
	 * @param {object} body ctx.request.body
	 * @return {object} user object created
	 */
	async register(body) {
		const { name, password, email, organization, role, isAdmin } = body;

		const hashPassword = await this.ctx.genHash(password);
		// const walletId = wallet || (await this.ctx.service.auth.fabric.registerInOrganization(name, organization));
		const walletId = await this.ctx.service.auth.fabric.registerInOrganization(name, organization);
		let previousId = (await this.ctx.model.Auth.User.find().sort({ id: -1 }))[0];
		previousId = previousId === undefined ? 0 : previousId.id;
		try {
			const user = await this.ctx.model.Auth.User.create({
				id: previousId + 1,
				name,
				password: hashPassword,
				email,
				organization,
				isAdmin,
				role,
				walletId,
			});
			if (!user) {
				return undefined;
			}
			return {
				id: user.id,
				name: user.name,
				email: user.email,
				walletId: user.walletId,
				organization: user.organization,
				role: user.role,
				isAdmin: user.isAdmin,
			};
		} catch (e) {
			console.error(e);
		}
	}
}

module.exports = AdministrationService;
