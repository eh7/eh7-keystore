
const crypto = require('crypto')
const aesjs = require('aes-js')
const scrypt = require("scrypt")
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')

const phrase = 'matrix faculty chicken craft phrase hint siege arena home sheriff skate divorce';

const phraseBytes = aesjs.utils.utf8.toBytes(phrase)

var myArgs = process.argv.slice(2);

if(!myArgs[0]) {
  console.log("USAGE: node setPassPhrase.js" + " <password for keystore>")
  process.exit(1)
}

var key = Buffer.from(myArgs[0])
var salt = crypto.randomBytes(32)
var result = scrypt.hashSync(key,{"N":Math.pow(2,18),"r":8,"p":1},32,salt)
//console.log(result.toString('hex'))
var aesCtr = new aesjs.ModeOfOperation.ctr(result, new aesjs.Counter(5))
var encryptedBytes = aesCtr.encrypt(phraseBytes)
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
//console.log(encryptedHex)



//console.log(encryptedHex.length)
//console.log((encryptedHex.length).toString(16).padStart(4,'0'))
//var keystore = salt.toString('hex') + (encryptedHex.length).toString(16).padStart(4,'0') + encryptedHex
var keystore = {}
keystore.salt = salt.toString('hex')
keystore.len = (encryptedHex.length).toString(16).padStart(4,'0')
keystore.ciphertext = encryptedHex

console.log(JSON.stringify(keystore))

  //------------------------------------------------------//
 // END HERE, below this point to test rebuilding phrase //
//------------------------------------------------------//

/*
var k_salt = Buffer.from(keystore.salt,'hex')
var k_len  = Buffer.from(keystore.len,'hex')
var k_ciphertext  = Buffer.from(keystore.ciphertext,'hex')

//console.log(k_salt)
//console.log(salt)

var result = scrypt.hashSync(key,{"N":Math.pow(2,18),"r":8,"p":1},32,k_salt);
//console.log(result)
var encryptedBytes = aesjs.utils.hex.toBytes(k_ciphertext.toString('hex'))
var aesCtr = new aesjs.ModeOfOperation.ctr(result, new aesjs.Counter(5))
var decryptedBytes = aesCtr.decrypt(encryptedBytes)
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
console.log(decryptedText)
process.exit()
*/

