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
	router.get("/initialize", controller.auth.initialize.index); // To be further test under clean env

	/**
	 * Auth router group
	 */
	router.post("/auth/login", controller.auth.login.login);
	router.post("/auth/signup", controller.auth.administration.register); // TBC
	router.get("/auth/organization", jwt, controller.auth.administration.getAllOrgs);
	router.get("/admin/:orgName/user", controller.auth.administration.getUsersByOrg);

	/**
	 * Documents router
	 */
	router.get("/document", controller.document.document.index);
	router.get("/document/:id", controller.document.document.find);
	router.post("/document", jwt, controller.document.document.create);
	router.get("/validate/:id", controller.document.document.validate);

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
