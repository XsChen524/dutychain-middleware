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

module.exports = { stringToNumberArray, strToStrArray };
