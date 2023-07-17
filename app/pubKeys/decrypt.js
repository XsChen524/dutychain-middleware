const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const privKeyPath = path.resolve(__dirname, "Org" + process.argv[2].toString() + "-priv.pem");
console.log("privKeyPath:", privKeyPath);
const privKey = fs.readFileSync(privKeyPath, "utf-8");

const encrypted_path = path.resolve(__dirname, "encrypted.txt");
const encrypted = fs.readFileSync(encrypted_path, "utf-8");
console.log("encrypted message:", encrypted);
const decrypted = crypto.privateDecrypt(privKey, Buffer.from(encrypted, "hex")).toString("utf-8");
console.log("decrypted message:", decrypted);
