/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = (exports = {});

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + "_1685192873898_8699";

	// add your middleware config here
	config.middleware = [];

	config.security = {
		csrf: {
			enable: false, // csrf turned off!!!
		},
	};

	config.cors = {
		origin: "*",
		allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
	};

	config.jwt = {
		secret: config.keys,
		sign: {
			expiresIn: 600000,
		},
	};

	config.bcrypt = {
		saltRounds: 10,
	};

	config.mongoose = {
		client: {
			url: "mongodb://localhost:27017/db_egg_1",
			options: {
				useUnifiedTopology: true,
			},
			// mongoose global plugins, expected a function or an array of function and options
			plugins: [],
		},
	};

	const userConfig = {
		// myAppName: 'egg',
	};

	return {
		...config,
		...userConfig,
	};
};
