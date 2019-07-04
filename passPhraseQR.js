
var myArgs = process.argv.slice(2);

if(!myArgs[0]) {
  console.log("USAGE: node passPhraseLoadOnSC.js" + " <keystore_file>")
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
console.log(keystoreString)

var Encoder = require('qr').Encoder
var encoder = new Encoder
//encoder.on('end', function(){
//})
encoder.encode(keystoreString.toString('utf8'), '/tmp/'+myArgs[0]+'.png',{
  background_color:'#ffffff',
  foreground_color:'#000000',
  margin: 4,
  level: 'L',
  dot_siz:1
})

/*
var qr = require('qr-image')
console.log(keystoreString.toString('utf8'))
var qr_svg = qr.image(keystoreString.toString('hex'), { type: 'png' });
//var qr_svg = qr.image("abc", { type: 'png' });
qr_svg.pipe(require('fs').createWriteStream(myArgs[0]+'.png'))
//var svg_string = qr.imageSync('I love QR!', { type: 'png' })

var qr = require("qr-image")
var qr_svg = qr.image('I love QR!', { type: 'svg' });
qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));
var svg_string = qr.imageSync('I love QR!', { type: 'svg' });
*/


/*
//process.exit()


var messageBuffer = Buffer.concat([keystoreLength,keystoreString])
//console.log(messageBuffer)

console.log(messageBuffer.toString('hex'))

var sector = 1
var block = 0
var byte = 0

var blockNumber = (sector * 4)

var blockHeader = "FF D6 00 "
var thisHexBlockNumber = 0
var blockBytes = ''

var addKeystoreToSC = ''

console.log("FF 82 00 00 06 FF FF FF FF FF FF")
addKeystoreToSC += "FF 82 00 00 06 FF FF FF FF FF FF\n"

for(var i=0; i<messageBuffer.length; i++) {

  thisHexBlockNumber = blockNumber.toString(16).toUpperCase().padStart(2, '0')

  blockBytes += ' ' + messageBuffer[i].toString(16).toUpperCase().padStart(2, '0')

  if(byte === 0 && block === 0) {
    console.log("FF 86 00 00 05 01 00 " + thisHexBlockNumber + " 60 00")
    addKeystoreToSC += "FF 86 00 00 05 01 00 " + thisHexBlockNumber + " 60 00\n"
  }

  if(block === 2 && byte === 15){
    blockNumber++
    blockNumber++
    block++
    block++
    sector++
    byte = 0
    block = 0
    addKeystoreToSC += blockHeader + thisHexBlockNumber + " 10" + blockBytes + "\n"
    console.log(blockHeader + thisHexBlockNumber + " 10" + blockBytes)
    console.log("FF B0 00 " + thisHexBlockNumber + " 10")
    blockBytes = ''
  } else if(byte === 15){
    blockNumber++
    block++
    byte = 0
    addKeystoreToSC += blockHeader + thisHexBlockNumber + " 10" + blockBytes + "\n"
    console.log(blockHeader + thisHexBlockNumber + " 10" + blockBytes)
    console.log("FF B0 00 " + thisHexBlockNumber + " 10")
    blockBytes = ''
  } else
    byte++
}

if(byte < 16) {
  for(var i=byte; i<16; i++) {
    blockBytes += ' ' + (0).toString(16).toUpperCase().padStart(2, '0')
  }
  addKeystoreToSC += blockHeader + thisHexBlockNumber + " 10" + blockBytes + "\n"
  console.log(blockHeader + thisHexBlockNumber + " 10" + blockBytes)
} else {
  addKeystoreToSC += blockHeader + thisHexBlockNumber + " 10" + blockBytes + "\n"
  addKeystoreToSC += "FF B0 00 " + thisHexBlockNumber + " 10" + "\n"
  console.log(blockHeader + thisHexBlockNumber + " 10" + blockBytes)
  console.log("FF B0 00 " + thisHexBlockNumber + " 10")
}

console.log("//---------------//")
console.log(addKeystoreToSC)
*/
