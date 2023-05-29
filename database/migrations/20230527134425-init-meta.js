"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("meta", {
			id: {
				primaryKey: true,
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				comment: "responsibility id",
			},
			name: {
				type: Sequelize.DataTypes.STRING(100),
				allowNull: false,
				comment: "responsibility name",
			},
			description: {
				type: Sequelize.DataTypes.STRING(200),
				allowNull: true,
				defaultValue: null,
				comment: "responsibility description",
			},
			projectId: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				comment: "id of project the responsibility belongs to",
			},
			previousTxns: {
				// Need to convert to type number[] in service
				type: Sequelize.DataTypes.TEXT,
				allowNull: false,
				defaultValue: "[]",
				comment: "previous txn ids of the responsibility",
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("meta");
	},
};
