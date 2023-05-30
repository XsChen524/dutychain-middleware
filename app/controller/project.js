"use strict";

const Controller = require("egg").Controller;

class ProjectController extends Controller {
	async createProject() {
		const { ctx } = this;
		const project = await ctx.service.project.create(ctx.request.body);
		if (!project) {
			ctx.status = 406;
			ctx.body = {
				success: false,
				data: undefined,
			};
			return;
		}
		ctx.status = 201;
		ctx.body = {
			success: true,
			data: project,
		};
		return;
	}

	async getAllProjects() {
		const ctx = this.ctx;
		const projects = await ctx.service.project.findAll();
		if (projects) {
			ctx.status = 200;
			ctx.body = {
				success: true,
				data: projects,
			};
		} else {
			ctx.status = 400;
			ctx.body = {
				success: false,
				data: undefined,
			};
		}
		return;
	}
}

module.exports = ProjectController;
