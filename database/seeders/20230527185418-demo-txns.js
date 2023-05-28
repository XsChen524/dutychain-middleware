"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"txns",
			[
				{
					id: "0x0000000000000000000000000000000000000000000000000000000000000001",
					blockId: 1,
					type: "update",
					operatorId: 1,
					description: "Update responsibility 1",
					fromVendor: 1,
					toVendor: 3,
					createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
					committedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
				{
					id: "0x0000000000000000000000000000000000000000000000000000000000000002",
					blockId: 1,
					type: "update",
					operatorId: 1,
					description: "Update responsibility 2",
					fromVendor: 2,
					toVendor: 3,
					createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
					committedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
				{
					id: "0x0000000000000000000000000000000000000000000000000000000000000003",
					blockId: 1,
					type: "update",
					operatorId: 1,
					description: "Update responsibility 2",
					fromVendor: 3,
					toVendor: 4,
					createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
					committedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
			],
			{}
		);
	},

	async down(queryInterface) {
		return queryInterface.bulkDelete("txns", null, {});
	},
};
