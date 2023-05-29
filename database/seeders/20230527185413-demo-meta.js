"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert(
			"meta",
			[
				{
					id: 1,
					name: "Estate selling on Midland",
					description:
						"Delivered estate ready for selling on Midland",
					projectId: 1,
					previousTxns:
						"[0x0000000000000000000000000000000000000000000000000000000000000001]",
				},
				{
					id: 2,
					name: "Estate project auditing",
					description: "Auditing by independent third-party BDO",
					projectId: 2,
					previousTxns:
						"[0x0000000000000000000000000000000000000000000000000000000000000002,0x0000000000000000000000000000000000000000000000000000000000000003]",
				},
			],
			{}
		);
	},

	async down(queryInterface) {
		return queryInterface.bulkDelete("meta", null, {});
	},
};
