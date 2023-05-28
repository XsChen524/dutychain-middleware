"use strict";

module.exports = (app) => {
	const { STRING, INTEGER, TEXT } = app.Sequelize;

	const Project = app.model.define("project", {
		id: {
			primaryKey: true,
			type: INTEGER,
			allowNull: false,
			autoIncrement: true,
		},
		name: {
			type: STRING(100),
			allowNull: false,
		},
		description: {
			type: STRING(200),
			allowNull: true,
			defaultValue: null,
		},
		vendorId: {
			// Need to convert to type number[] in service
			type: TEXT,
			allowNull: false,
			defaultValue: "[]",
		},
	});

	return Project;
};
