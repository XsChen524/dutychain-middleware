"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("projects", {
			id: {
				primaryKey: true,
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				comment: "project id",
			},
			name: {
				type: Sequelize.DataTypes.STRING(100),
				allowNull: false,
				comment: "project name",
			},
			description: {
				type: Sequelize.DataTypes.STRING(200),
				allowNull: true,
				defaultValue: null,
				comment: "project description",
			},
			vendorId: {
				// Need to convert to type number[] in service
				type: Sequelize.DataTypes.TEXT,
				allowNull: false,
				defaultValue: "[]",
				comment: "ids of project vendors",
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("projects");
	},
};
