"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
	const { router, controller } = app;
	router.get("/", controller.home.index);

	// Vendors
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

	// Documents
	router.get("/document", controller.doc.getDocList);
	router.post("/document", controller.doc.uploadDoc);
};
