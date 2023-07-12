"use strict";

const Service = require("egg").Service;

class LoginService extends Service {
	/**
	 * User login, token signing after successfully logged in
	 * @param {object} body ctx.request.body
	 * @return {object} {email, token}
	 */
	async loginByName(body) {
		const { name, password } = body;
		console.log(body);
		const user = (await this.ctx.model.Auth.User.find({ name }))[0];
		if (!user) return undefined;
		const match = await this.ctx.compare(password, user.password);
		if (match) {
			const { id, name, email, organization, role, isAdmin, walletId } =
				user;
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
			return {
				id,
				name,
				email,
				organization,
				role,
				isAdmin,
				walletId,
				token,
			};
		}
	}
}

module.exports = LoginService;
