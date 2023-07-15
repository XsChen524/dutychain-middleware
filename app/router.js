"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
	const { router, controller, jwt } = app;
	router.get("/", controller.home.index);

	/**
	 * Auth router group
	 */
	router.post("/auth/login", controller.auth.auth.login);
	router.get("/auth", jwt, controller.auth.auth.index);
	router.post("/auth/signup", controller.auth.administration.register);
	router.get(
		"/auth/organization",
		jwt,
		controller.auth.administration.getAllOrgs
	);
	router.get(
		"/admin/:orgName/user",
		controller.auth.administration.getUsersByOrg
	);

	// Register
	// router.post("/register", controller.register.register);

	// Used for Debugging
	router.get("/debug", controller.debug.index);
	router.post("/debug", controller.debug.index);
	router.get("/debug/readall", controller.debug.readAll);
	router.post("/debug/readall", controller.debug.readAll);
	router.get("/debug/read", controller.debug.read);
	router.post("/debug/read", controller.debug.read);
	router.get("/debug/create", controller.debug.create);
	router.post("/debug/create", controller.debug.create);
	router.get("/debug/init", controller.debug.init);
	router.post("/debug/init", controller.debug.init);

	// Documents
	// body = { title, data, vendorId, walletId, org }
	router.get("/document", jwt, controller.doc.getDocList);
	router.post("/document", jwt, controller.doc.uploadDoc);
	router.post("/document/query", jwt, controller.doc.queryDoc);
	router.post("/document/validate", jwt, controller.doc.validateDoc);
};
