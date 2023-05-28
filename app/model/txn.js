"use strict";

module.exports = (app) => {
	const { STRING, INTEGER, DATE } = app.Sequelize;

	const Txn = app.model.define("txn", {
		id: {
			// Digest length 66 for Ethereum, need to confirm HF
			primaryKey: true,
			type: STRING(66),
			allowNull: false,
		},
		blockId: {
			type: INTEGER,
			allowNull: false,
		},
		type: {
			type: STRING,
			allowNull: false,
		},
		operatorId: {
			type: INTEGER,
			allowNull: false,
		},
		description: {
			type: STRING(200),
			allowNull: true,
			defaultValue: null,
		},
		fromVendor: {
			type: INTEGER,
			allowNull: false,
		},
		toVendor: {
			type: INTEGER,
			allowNull: false,
		},
		createdAt: {
			type: DATE,
			allowNull: false,
		},
		committedAt: {
			type: DATE,
			allowNull: true,
		},
	});

	return Txn;
};
