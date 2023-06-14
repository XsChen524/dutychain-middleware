/* eslint-disable array-bracket-spacing */

const organizations = [
	{ id: 1, name: "CheungKong" },
	{ id: 2, name: "NewWorld" },
	{ id: 3, name: "House730" },
	{ id: 4, name: "PwC" },
	{ id: 5, name: "Midland" },
];

const channels = [
	{ projectId: 1, name: "Pokfulam Garden", vendorId: [1, 3, 4] },
	{ projectId: 2, name: "New City", vendorId: [2, 3, 4] },
];

const request = {
	header: { authorization: jwt },
	body: {
		operation: {
			type: "transfer",
			targetId: 3,
		},
		idendity: {
			channel: "Pokfulam Garden",
			organization: "CheungKong",
			user: "user1",
			idDigest: "35a99a53ff1b46f86a14a375742dfd7c",
		},
	},
};

module.exports = { organizations, channels };
