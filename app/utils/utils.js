const crypto = require("crypto");

function stringToNumberArray(str) {
	const tmpArray = str.split(",");
	for (let i = 0; i < tmpArray.length; i += 1) {
		tmpArray[i] = tmpArray[i].replace("[", "");
		tmpArray[i] = tmpArray[i].replace("]", "");
	}
	const returnArray = [];
	for (let i = 0; i < tmpArray.length; i += 1) {
		returnArray.push(Number(tmpArray[i]));
	}
	return returnArray;
}

function strToStrArray(str) {
	const tmpArray = str.split(",");
	for (let i = 0; i < tmpArray.length; i += 1) {
		tmpArray[i] = tmpArray[i].replace("[", "");
		tmpArray[i] = tmpArray[i].replace("]", "");
	}
	return tmpArray;
}

function randomString(len) {
	if (!Number.isFinite(len)) {
		throw new TypeError("Expected a finite number");
	}

	return crypto
		.randomBytes(Math.ceil(len / 2))
		.toString("hex")
		.slice(0, len);
}

function hash(str) {
	return crypto.createHash("sha256").update(str).digest("hex");
}

module.exports = { stringToNumberArray, strToStrArray, randomString, hash };
