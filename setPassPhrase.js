
const crypto = require('crypto')
const aesjs = require('aes-js')
const scrypt = require("scrypt")
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')

const phrase = 'matrix faculty chicken craft phrase hint siege arena home sheriff skate divorce';

const phraseBytes = aesjs.utils.utf8.toBytes(phrase)

var myArgs = process.argv.slice(2);

var key = Buffer.from(myArgs[0])
var salt = crypto.randomBytes(32)
var result = scrypt.hashSync(key,{"N":Math.pow(2,18),"r":8,"p":1},32,salt);
var aesCtr = new aesjs.ModeOfOperation.ctr(result, new aesjs.Counter(5))
var encryptedBytes = aesCtr.encrypt(phraseBytes)
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

//var keystore = salt.toString('hex') + (encryptedHex.length).toString(16).padStart(4,'0') + encryptedHex
var keystore = {}
keystore.salt = salt.toString('hex')
keystore.len = (encryptedHex.length).toString(16).padStart(4,'0')
keystore.ciphertext = encryptedHex

console.log(JSON.stringify(keystore))

console.log(keystore.salt.toString('hex'))
console.log(salt.toString('hex'))
var result = scrypt.hashSync(key,{"N":Math.pow(2,18),"r":8,"p":1},32,keystore.salt);
//var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
var encryptedBytes = aesjs.utils.hex.toBytes(keystore.ciphertext)
var aesCtr = new aesjs.ModeOfOperation.ctr(result, new aesjs.Counter(5))
var decryptedBytes = aesCtr.decrypt(encryptedBytes)
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
console.log(decryptedText)



/*
var result = scrypt.hashSync(key,{"N":Math.pow(2,18),"r":8,"p":1},32,salt)
var aesKey = []
for (var i = 0; i < result.length; i+=1) {
  aesKey.push(result[i])
}
console.log(result.toString('hex'))
*/

/*
console.log(keystore.substr(0,64))
console.log(keystore.substr(64,4))
console.log(keystore.substr(68))
console.log(keystore.substr(68).length)
console.log((keystore.substr(68).length).toString(16))
//console.log(encryptedHex,encryptedHex.length,salt.toString('hex'))

var encryptedHex = "0001020311223344556677889900"
console.log((encryptedHex.length).toString(16).padStart(4,'0'))

process.exit()
*/
