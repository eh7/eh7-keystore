
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

var password = myArgs[0]

var scryptKey = new Buffer.from(password)

var salt = keystore.salt
var len  = keystore.len
var ciphertext  = keystore.ciphertext

console.log(salt,len,ciphertext)

/*
salt = '518427865d432bddfb5e4c2b0ec37038edc56a4005988a6cf8d920cbc6ddb5a7'
ciphertext = 'bf4ffb378492b622d1a115011cec62cf30c083de1b3207ab435c7661964accb6fbdeee14687bda38cb070bfff9a72cdcd1fcec49e86f9a59f7dd27b455b489f72ae98aae856b67acb443735d862c98'
*/

//console.log(salt,len,ciphertext)

var result = scrypt.hashSync(scryptKey,{"N":Math.pow(2,18),"r":8,"p":1},32,salt)
var aesKey = []
for (var i = 0; i < result.length; i+=1) {
  aesKey.push(result[i])
}
//console.log(result.toString('hex'))
//process.exit()

//console.log(aesKey.toString('hex'))

var aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5))
console.log(ciphertext)
var encryptedBytes = aesjs.utils.hex.toBytes(ciphertext)
console.log(encryptedBytes.toString('hex'))
var decryptedBytes = aesCtr.decrypt(encryptedBytes)
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)

console.log("decryptedText:",decryptedText)
/*
*/
process.exit()
