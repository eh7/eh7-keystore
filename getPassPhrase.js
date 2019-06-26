
var myArgs = process.argv.slice(2);

if(!myArgs[0]) {
  console.log("USAGE: node getPassPhrase.js" + " <password for keystore>")
  process.exit(1)
} 

var fs = require('fs')
const aesjs = require('aes-js')
const scrypt = require("scrypt")
const hdkey = require('ethereumjs-wallet/hdkey')

const keystore = require('./keystore.eh7.json')

console.log(keystore)

var key = Buffer.from(myArgs[0])
var k_salt = Buffer.from(keystore.salt,'hex')
var k_len  = Buffer.from(keystore.len,'hex')
var k_ciphertext  = Buffer.from(keystore.ciphertext,'hex')

//console.log(k_salt)
//console.log(k_len)
//console.log(k_ciphertext)

var result = scrypt.hashSync(key,{"N":Math.pow(2,18),"r":8,"p":1},32,k_salt);
var encryptedBytes = aesjs.utils.hex.toBytes(k_ciphertext.toString('hex'))
var aesCtr = new aesjs.ModeOfOperation.ctr(result, new aesjs.Counter(5))
var decryptedBytes = aesCtr.decrypt(encryptedBytes)
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
console.log(decryptedText)
