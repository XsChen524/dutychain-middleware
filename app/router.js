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
	router.get("/debug/debugReadAll", controller.debug.debugReadAll);
	router.post("/debug/debugReadAll", controller.debug.debugReadAll);

	// Documents
	// body = { title, data, vendorId, walletId, org }
	router.get("/document", controller.doc.getDocList);
	router.post("/document", controller.doc.uploadDoc);
};
