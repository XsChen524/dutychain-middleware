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

	// add your user config here

	config.mongoose = {
		client: {
			url: 'mongodb://test:123456@38.147.173.101/test',
			options: {},
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
