
var myArgs = process.argv.slice(2);

const thisFrilenamwe = __filename.slice(__dirname.length + 1)

if(!myArgs[0]) {
  console.log("USAGE: node " + thisFrilenamwe + " <keystore_file>")
  process.exit(1)
}

var fs = require('fs')
const aesjs = require('aes-js')
const scrypt = require("scrypt")
const hdkey = require('ethereumjs-wallet/hdkey')

//const keystore = require('./keystore.eh7.json')
const keystore = require('./' + myArgs[0])

//console.log(keystore)

var k_salt = Buffer.from(keystore.salt,'hex')
var k_len  = Buffer.from(keystore.len,'hex')
var k_ciphertext  = Buffer.from(keystore.ciphertext,'hex')

//console.log(k_salt,k_len,k_ciphertext)


const keystoreLength = Buffer.from((JSON.stringify(keystore).length).toString(16).padStart(4,'0'), 'hex')

const keystoreString = Buffer.from(JSON.stringify(keystore))

//console.log(keystoreLength)
//console.log(keystoreString)


var messageBuffer = Buffer.concat([keystoreLength,keystoreString])
console.log(messageBuffer)

//console.log(keystoreLength + messageBuffer)

var page = 5
var byte = 0

var thisHexPageNumber = 0

var writeCommand = "FF D6 00"
var numberOfBytes = "04"
var hexBytes = ''

for(var i=0; i<messageBuffer.length; i++) {

//  var hexByte = byte.toString(16).toUpperCase().padStart(2, '0')
  var hexByte = messageBuffer[i].toString(16).toUpperCase().padStart(2, '0')

//  thisHexBlockNumber = blockNumber.toString(16).toUpperCase().padStart(2, '0')

  thisHexPageNumber = page.toString(16).toUpperCase().padStart(2, '0')

  hexBytes += ' ' + hexByte

//  console.log(thisHexPageNumber,hexByte)

  if(byte === 3) {
    console.log(writeCommand + ' ' + thisHexPageNumber + ' ' + numberOfBytes + hexBytes)
    hexBytes = ''
    byte = 0
    page++
  } else
    byte++
}

if(byte < 3) {
  for(var i=byte; i<4; i++) {
    hexBytes += ' ' + (0).toString(16).toUpperCase().padStart(2, '0')
  }
  console.log(writeCommand + ' ' + thisHexPageNumber + ' ' + numberOfBytes + hexBytes)
}

process.exit()

