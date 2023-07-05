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
	router.get("/hp", controller.debug.index);
	router.get("/hp/readall", controller.debug.readAll);
	router.post("/hp/readall", controller.debug.readAll);
	router.get("/hp/read", controller.debug.read);
	router.post("/hp/read", controller.debug.read);
	router.get("/hp/create", controller.debug.create);
	router.post("/hp/create", controller.debug.create);
	router.get("/hp/init", controller.debug.init);
	router.post("/hp/init", controller.debug.init);
	router.get("/hp/debugReadAll", controller.debug.debugReadAll);
	router.post("/hp/debugReadAll", controller.debug.debugReadAll);

	// Documents
	// body = { title, data, vendorId, walletId, org }
	router.get("/document", jwt, controller.doc.getDocList);
	router.post("/document", jwt, controller.doc.uploadDoc);
	router.post("/document/query", jwt, controller.doc.queryDoc);
	router.post("/document/validate", jwt, controller.doc.validateDoc);
};
