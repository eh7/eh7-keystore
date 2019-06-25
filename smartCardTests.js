
var aesjs = require('aes-js')
var scrypt = require("scrypt")
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')

//const phrase = bip39.generateMnemonic()
const phrase = 'matrix faculty chicken craft phrase hint siege arena home sheriff skate divorce';

let myHdWallet = hdkey.fromMasterSeed(phrase)

const password = 'testpassword';
const address = '008aeeda4d805471df9b2a5b0f38a0c3bcba786b'


const keyfile = {
    "crypto" : {
        "cipher" : "aes-128-ctr",
        "cipherparams" : {
            "iv" : "83dbcc02d8ccb40e466191a123791e0e"
        },
        "ciphertext" : "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
        "kdf" : "scrypt",
        "kdfparams" : {
            "dklen" : 32,
            "n" : 262144,
            "p" : 8,
            "r" : 1,
            "salt" : "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
        },
        "mac" : "2103ac29920d71da29f15d75b4a16dbe95cfd7ff8faea1056c33131d846e3097"
    },
    "id" : "3198bc9c-6672-5ab3-d995-4942343ae5b6",
    "version" : 3
}

console.log(phrase)
console.log(password)
console.log(keyfile)

var runTime = 1
var key = new Buffer(password)
var scryptParameters = scrypt.paramsSync(runTime)
var kdfResult = scrypt.kdfSync(key, scryptParameters)
console.log(kdfResult.toString('hex'))
console.log(kdfResult.toString('hex').substr(16,16) + keyfile.crypto.ciphertext)

process.exit(0)

var key = Buffer.from(password)
//var scryptParameters =  { N: 20, r: 8, p: 1 }
var scryptParameters = scrypt.paramsSync(5)

var kdfResult = scrypt.kdfSync(key, scryptParameters)
//console.log(kdfResult.toString("base64"))
console.log(kdfResult.toString("hex"))
console.log(scryptParameters)
console.log("Synchronous result: "+kdfResult.toString("hex"))
console.log(kdfResult.length)

var blocks = kdfResult.toString("hex").match(/.{1,16}/g)
console.log(blocks)

var key = kdfResult.toString('hex').substr(16,47)
console.log(key)
var key = kdfResult.toString('hex').substr(0,64)
console.log(key)


/*
var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]
console.log(key)

var phraseBytes = aesjs.utils.utf8.toBytes(phrase)
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
var encryptedBytes = aesCtr.encrypt(phraseBytes)
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
//console.log(encryptedBytes)
console.log(encryptedHex)

var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
var decryptedBytes = aesCtr.decrypt(encryptedBytes)
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
console.log(decryptedText)

var blocks = encryptedHex.match(/.{1,16}/g)
var count  = blocks.length
console.log(blocks,count,encryptedHex.length)
*/


/*
var hexLabel = Buffer.from(kdfResult.toString('hex').substr(0,6),'hex')
console.log(kdfResult.toString().substr(0,6))
console.log(kdfResult.toString('hex').substr(6,1))
console.log(kdfResult.toString('hex').substr(8,4))
console.log(kdfResult.toString('hex').substr(12,4))
console.log(kdfResult.toString('hex').substr(16,32))
console.log(kdfResult.toString('hex').substr(48,16))
console.log(kdfResult.toString('hex').substr(64,32))
*/

/*
var kdfResult = scrypt.kdfSync(key, scryptParameters)
console.log(kdfResult.toString("base64"))
console.log(kdfResult.toString("hex"))
console.log(scrypt.verifyKdfSync(kdfResult, "pleaseletmein"))
console.log(scrypt.verifyKdfSync(kdfResult, password))
*/
