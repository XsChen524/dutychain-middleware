"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("txns", {
			id: {
				// Digest length 66 for Ethereum, need to confirm HF
				primaryKey: true,
				type: Sequelize.DataTypes.STRING(66),
				allowNull: false,
				comment: "PK_Transaction digest",
			},
			blockId: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				comment: "Block id containing txn",
			},
			type: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				comment: "operation type",
			},
			operatorId: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				comment: "User id who commits the txn",
			},
			description: {
				type: Sequelize.DataTypes.STRING(200),
				allowNull: true,
				defaultValue: null,
				comment: "responsibility description",
			},
			fromVendor: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				comment: "id from whom responsibility transferred",
			},
			toVendor: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				comment: "id to whom responsibility transferred",
			},
			createAt: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},
			committedAt: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("txns");
	},
};
