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
					role: "Agency",
				},
				{
					name: "BDO",
					description: "BDO China",
					role: "Auditor",
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			"vendors",
			{
				name: {
					[Op.eq]: "CK",
					[Op.eq]: "New World",
					[Op.eq]: "Midland",
					[Op.eq]: "BDO",
				},
			},
			{}
		);
	},
};
