/* eslint valid-jsdoc: "off" */

"use strict";

module.exports = () => {
	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = (exports = {});

	config.cluster = {
		listen: {
			port: 7010,
			hostname: "127.0.0.1",
		},
	};

	return {
		...config,
	};
};
