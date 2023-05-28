"use strict";

const Controller = require("egg").Controller;

class ProjectController extends Controller {
	async createProject() {
		const { ctx } = this;
		const project = await ctx.service.project.create(ctx.request.body);
		if (!project) {
			ctx.status = 406;
			ctx.body = undefined;
			return;
		}
		ctx.status = 201;
		ctx.body = project;
		return;
	}

	async getAllProjects() {
		const ctx = this.ctx;
		const projects = await ctx.service.project.findAll();
		if (projects) {
			ctx.status = 200;
		} else {
			ctx.status = 400;
		}
		ctx.body = projects;
		return;
	}
}

module.exports = ProjectController;
