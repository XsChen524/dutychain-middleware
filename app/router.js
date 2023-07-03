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
	router.post("/auth/signup", controller.auth.register);
	router.post("/auth/login", controller.auth.login);
	router.get("/auth", jwt, controller.auth.index);
	router.get("/auth/organization", jwt, controller.auth.getAllOrgs);

	// Vendors
	/*
	router.get("/vendor", controller.vendor.getAllVendors);
	router.post("/vendor", controller.vendor.createVendor);

	// Projects
	router.get("/project", controller.project.getAllProjects);
	router.post("/project", controller.project.createProject);

	// Responsibilities
	router.get("/meta", controller.meta.getAllResponsibilities);
	router.post("/meta", controller.meta.createResponsibility);

	// Transactions
	router.get("/txn", controller.txn.getAllTxns);
	router.post("/txn", controller.txn.createTxn);

	*/

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
	router.get("/document", controller.doc.getDocList);
	router.post("/document", controller.doc.uploadDoc);
	router.post("/document/query", controller.doc.queryDoc);
	router.post("/document/validate", controller.doc.validateDoc);
};
