const users = [
	{
		id: 1,
		email: "admin@org1.com",
		name: "admin1",
		// 123456
		password:
			"$2a$10$KjQWd7vsgJ8LYsSTHq1Dju2RmV8JC2s5aetvDdQl1eqIS5vb7lv0u",
		organization: "Org1",
		// Client or vendor
		role: "vendor",
		isAdmin: true,
	},
	{
		id: 2,
		email: "admin@org2.com",
		name: "admin2",
		// 123456
		password:
			"$2a$10$KjQWd7vsgJ8LYsSTHq1Dju2RmV8JC2s5aetvDdQl1eqIS5vb7lv0u",
		organization: "Org2",
		// Client or vendor
		role: "vendor",
		isAdmin: true,
	},
];

module.exports = users;
