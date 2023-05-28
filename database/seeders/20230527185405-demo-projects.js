"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert(
			"projects",
			[
				{
					id: 1,
					name: "Pokfulam Garden",
					description: "Multi-purpose housing estate",
					vendorId: "[1, 3, 4]",
				},
				{
					id: 2,
					name: "New City",
					description: "Large-scale housing estate",
					vendorId: "[2, 3, 4]",
				},
			],
			{}
		);
	},

	async down(queryInterface) {
		return queryInterface.bulkDelete("projects", null, {});
	},
};
