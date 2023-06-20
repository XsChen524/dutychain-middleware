"use strict";

const Service = require("egg").Service;

class AuthService extends Service {
	async getOrganizations() {
		try {
			const orgs = await this.ctx.model.Auth.Organization.find();
			return orgs;
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
		// const hash = bcrypt.hashSync(password, this.config.bcrypt.saltRounds);
		const { name, password, email, organization, role } = body;
		let previousId = (
			await this.ctx.model.Auth.Meta.find().sort({ id: -1 })
		)[0];
		previousId = previousId === undefined ? 0 : previousId.id;
		const user = await this.ctx.model.User.create({
			id: previousId + 1,
			name,
			password,
			email,
			organization,
			role,
		});
		return user;
	}

	/**
	 * User login, token signing after successfully logged in
	 * @param {object} body ctx.request.body
	 * @return {object} {email, token}
	 */
	async loginByName(body) {
		const { name, password } = body;
		const user = (await this.ctx.model.Auth.User.find({ name }))[0];
		if (!user) return undefined;
		if (password === user.password) {
			const { id } = user;
			const {
				jwt: {
					secret,
					sign: { expiresIn },
				},
			} = this.app.config; // Load jwt options from config
			const token = this.app.jwt.sign(
				{
					id,
					iat: new Date().valueOf(),
				},
				secret,
				{ expiresIn }
			); // Token generation, expires in 7 days
			return { id, name, token };
		}
	}
}

module.exports = AuthService;
