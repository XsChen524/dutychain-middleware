"use strict";

const Service = require("egg").Service;
const { stringToNumberArray } = require("../utils/utils");

class ProjectService extends Service {
	async create(body) {
		/**
		 * @param {String} vendorId Get string from request body,
		 * need stringfying at frontend.
		 */
		const { name, description, vendorId } = body;
		try {
			const project = await this.ctx.model.Project.insertMany([{
				name,
				description,
				vendorId,
			}]);
			return project;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	async findAll() {
		const projects = await this.ctx.model.Project.find();
		if (!projects) {
			return undefined;
		}
		// Parse the vendorId to number[]
		for (let i = 0; i < projects.length; i += 1) {
			projects[i].vendorId = stringToNumberArray(projects[i].vendorId);
		}
		return projects;
	}
}

module.exports = ProjectService;
