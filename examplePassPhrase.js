
var aesjs = require('aes-js')
var scrypt = require("scrypt")
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')

var key = Buffer.from('pleaseletmein')
var salt = Buffer.from('SodiumChloride')
var result = scrypt.hashSync(key,{"N":Math.pow(2,18),"r":8,"p":1},32,salt);
console.log(result.toString('hex'))

var key = []
for (var i = 0; i < result.length; i+=1) {
  key.push(result[i])
}

const phrase = 'matrix faculty chicken craft phrase hint siege arena home sheriff skate divorce';

var phraseBytes = aesjs.utils.utf8.toBytes(phrase)
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
var encryptedBytes = aesCtr.encrypt(phraseBytes)
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
console.log(encryptedHex)


var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
var decryptedBytes = aesCtr.decrypt(encryptedBytes)
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
console.log(decryptedText)

var keystore = {}
keystore.cipher = "aes-128-ctr"
keystore.salt   = "SodiumChloride"
keystore.ciphertext = "3c275a1769c8fd4b9ab1f4194d2e4114292cf545eb535c225dad72efff02b9e502f25a326653b487c43c1fef0430fc0074b9d94a883ae338125b7e19c4f7dc9fde17ae93ae76fe01a480dbb6e2d669"

var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
var encryptedBytes = aesjs.utils.hex.toBytes(keystore.ciphertext)
var decryptedBytes = aesCtr.decrypt(encryptedBytes)
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
console.log(decryptedText)

console.log(keystore)
