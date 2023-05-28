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
};
