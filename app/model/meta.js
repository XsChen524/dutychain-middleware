"use strict";

module.exports = (app) => {
	const { STRING, INTEGER, TEXT } = app.Sequelize;

	const Meta = app.model.define("meta", {
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
		projectId: {
			type: INTEGER,
			allowNull: false,
		},
		previousTxns: {
			// Need to convert to type number[] in service
			type: TEXT,
			allowNull: false,
			defaultValue: "[]",
		},
	});

	return Meta;
};
