"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert(
			"vendors",
			[
				{
					name: "CK",
					description: "Cheung Kong (Holdings) Limited",
					role: "contractor",
				},
				{
					name: "New World",
					description: "New World Development",
					role: "contractor",
				},
				{
					name: "Midland",
					description: "Midland Holdings Limited",
					role: "agency",
				},
				{
					name: "BDO",
					description: "BDO China",
					role: "auditor",
				},
			],
			{}
		);
	},

	async down(queryInterface) {
		return queryInterface.bulkDelete("vendors", null, {});
	},
};
