"use strict";

module.exports = (app) => {
	const { STRING, INTEGER } = app.Sequelize;

	const Vendor = app.model.define("vendor", {
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
		role: {
			type: STRING(100),
			allowNull: false,
			defaultValue: "contractor",
		},
	});

	return Vendor;
};
