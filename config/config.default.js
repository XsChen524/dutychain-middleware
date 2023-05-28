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

	config.sequelize = {
		dialect: "mysql",
		host: "127.0.0.1",
		port: 3306,
		database: "dutychain_middle",
		username: "dutychain_middle",
		password: "Fa4Yx7it5NGFDSCG",
		timezone: "+08:00",
		define: {
			timestamps: false, // Auto-update createdAt, updatedAt
		},
	};

	config.security = {
		csrf: {
			enable: false, // csrf turned off!!!
		},
	};

	// add your user config here
	const userConfig = {
		// myAppName: 'egg',
	};

	return {
		...config,
		...userConfig,
	};
};
