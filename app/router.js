"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
	const { router, controller, jwt } = app;
	router.get("/", controller.home.index);

	/**
	 * Initialization
	 */
	router.get("/initialize", controller.auth.initialize.index); // Tested

	/**
	 * Auth router group
	 */
	router.post("/auth/login", controller.auth.login.login); // Tested
	router.post("/auth/signup", jwt, controller.auth.administration.register); // Tested
	router.get("/auth/organization", jwt, controller.auth.administration.getAllOrgs);
	router.get("/admin/:orgName/user", controller.auth.administration.getUsersByOrg);

	/**
	 * Documents router
	 */
	router.get("/index", jwt, controller.document.document.index); // Tested
	router.get("/document", controller.document.document.find); // Tested
	router.get("/document/:id", controller.document.document.find); // Tested
	router.post("/document", jwt, controller.document.document.create); // Tested
	router.get("/validate/:id", jwt, controller.document.document.validate); // Tested

	/*
	router.get("/debug/readall", controller.debug.readAll);
	router.post("/debug/readall", controller.debug.readAll);
	router.get("/debug/read", controller.debug.read);
	router.post("/debug/read", controller.debug.read);
	router.post("/debug/create", controller.debug.create);
	router.get("/debug/init", controller.debug.init);
	router.post("/debug/init", controller.debug.init);
	*/
};
