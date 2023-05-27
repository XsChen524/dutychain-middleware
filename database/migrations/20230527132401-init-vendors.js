"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("vendors", {
			id: {
				primaryKey: true,
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				comment: "vendor id",
			},
			name: {
				type: Sequelize.DataTypes.STRING(100),
				allowNull: false,
				comment: "vendor name",
			},
			description: {
				type: Sequelize.DataTypes.STRING(200),
				allowNull: true,
				defaultValue: null,
				comment: "vendor description",
			},
			role: {
				type: Sequelize.DataTypes.STRING(100),
				allowNull: false,
				defaultValue: "contractor",
				comment: "vendor role",
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("vendors");
	},
};
