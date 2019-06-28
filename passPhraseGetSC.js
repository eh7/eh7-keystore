
var myArgs = process.argv.slice(2);

if(!myArgs[0]) {
  console.log("USAGE: node getPassPhrase.js" + " <password for keystore>")
  process.exit(1)
} 

var fs = require('fs')
const aesjs = require('aes-js')
const scrypt = require("scrypt")
const hdkey = require('ethereumjs-wallet/hdkey')

var pcsc = require('pcsclite')
var async = require('async')

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendSCCommands(scCommands) {

//  console.log('Taking a break...');
//  console.log('One seconds later, showing sleep in a loop...');
//  console.log(scCommands)

  for(var j=0; j<scCommands.length; j++) {
    console.log(scCommands[j])
    await sleep(1000);
  }

}

var pcsc = pcsc()

pcsc.on('reader', function(reader) {
  console.log('New reader detected', reader.name)

  function test(val, done) {
    done(val)
  }

  async function handleSCCommands (scCommands, protocol, keyLength) {
    var keystore = ''
    for(var j=0; j<scCommands.length; j++) {
      var data = await sendCommand(scCommands[j], protocol)
      var cleanData = data.toString('hex').replace(/9000/,"")
      if(cleanData !== '')
        keystore += cleanData
    }
//    console.log(keystore)
//    console.log(Buffer.from(keystore.substr(4,keyLength*2),'hex'))
//    console.log(Buffer.from(keystore.substr(4,keyLength*2),'hex').toString())
    var thisKeystoreFile = Buffer.from(keystore.substr(4,keyLength*2),'hex').toString()
    thisKeystoreFile = JSON.parse(thisKeystoreFile)

    var key = Buffer.from(myArgs[0])

    var k_salt = Buffer.from(thisKeystoreFile.salt,'hex')
    var k_len  = Buffer.from(thisKeystoreFile.len,'hex')
    var k_ciphertext  = Buffer.from(thisKeystoreFile.ciphertext,'hex')

    console.log(k_salt)
    console.log(k_len)
    console.log(k_ciphertext)

    var result = scrypt.hashSync(key,{"N":Math.pow(2,18),"r":8,"p":1},32,k_salt);
    var encryptedBytes = aesjs.utils.hex.toBytes(k_ciphertext.toString('hex'))
    var aesCtr = new aesjs.ModeOfOperation.ctr(result, new aesjs.Counter(5))
    var decryptedBytes = aesCtr.decrypt(encryptedBytes)
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
    console.log(decryptedText)

    var phrase = decryptedText
    //console.log(phrase)
    let myHdWallet = hdkey.fromMasterSeed(phrase)
    console.log('paddress', "0x"+myHdWallet.getWallet().getPrivateKey().toString('hex'))
    console.log('aaddress', "0x"+myHdWallet.getWallet().getAddress().toString('hex'))

    process.exit()
  }

  function sendCommand(cmd, protocol, done) {
    return new Promise(function(resolve){
      var array = cmd.split(" ")
      var hex = cmd.replace(/ /g,"")
      var buffer = Buffer.from(hex,'hex')

      reader.transmit(buffer, 40, protocol, function(err, data) {
//        console.log('Data received', data)
        resolve(data)
      })
    })
  }

  reader.on('error', function(err) {
    console.log('Error(', this.name, '):', err.message)
  })

  reader.on('status', function(status) {
    console.log('Status(', this.name, '):', status)
    // check what has changed //
    var changes = this.state ^ status.state
    if (changes) {
console.log(changes & this.SCARD_STATE_EMPTY)
      if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
        console.log("card removed");// card removed //
        reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Disconnected')
            process.exit()
          }
        })
      } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
        console.log("card inserted") // card inserted //
        reader.connect({ share_mode : this.SCARD_SHARE_SHARED }, function(err, protocol) {
          if (err) {
            console.log(err)
          } else {
            console.log('Protocol(', reader.name, '):', protocol)
//            reader.transmit(new Buffer.from([0xFF, 0xCA, 0x00, 0x00, 0x00]), 40, protocol, function(err, data) {

            // load auth data
            reader.transmit(new Buffer.from([0xFF, 0x82, 0x00, 0x00, 0x06, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), 40, protocol, function(err, data) {
              if (err) {
                console.log(err)
              } else {
                console.log('Data received', data)

                // authenticate against block 04 
                reader.transmit(new Buffer.from([0xFF,0x86,0x00,0x00,0x05,0x01,0x00,0x04,0x60,0x00]), 40, protocol, function(err, data) {
//                  console.log('Data received', data)

                  // get binary data at block 04
                  reader.transmit(new Buffer.from([0xFF,0xB0,0x00,0x04,0x10]), 40, protocol, function(err, data) {
//                    console.log('Data received', data)
     //               var keyLength = parseInt(data.toString('hex').substr(0,4), 16) 
                    var keyLength = data.toString('hex').substr(0,4) 

                    // get int data length
                    keyLength = parseInt(keyLength, 16)
//                    console.log(keyLength)
   
                    // figure out end block
                    var sector = 1
                    var block = 0
                    var byte = 0

                    var bytes = keyLength + 4
                    var blocks = bytes / 16

                    var blockNumber = (sector * 4)
                    var thisHexBlockNumber = 0
                    var blockBytes = ''
                    var bufferData = Buffer.from(data.toString('hex'), 'hex')

//                    console.log(bytes,blocks)
                    var byte = 0

                    var scCommands = []

                    scCommands.push("FF 82 00 00 06 FF FF FF FF FF FF")

                    for(var i=0; i<bytes; i++) {
                      thisHexBlockNumber = blockNumber.toString(16).toUpperCase().padStart(2, '0')
//                      console.log(i,byte)
                      if(byte === 0 && block === 0){
                        scCommands.push("FF 86 00 00 05 01 00 " + thisHexBlockNumber + " 60 00")
//                        console.log(sector,block,byte,thisHexBlockNumber)
                      }
                      if(block === 2 && byte === 15){ 
                        blockNumber++
                        blockNumber++
                        block++
                        block++
                        sector++
                        byte = 0
                        block = 0
                        scCommands.push("FF B0 00 " + thisHexBlockNumber + " 10")
                      } else if(byte === 15){
                        blockNumber++
                        block++
                        byte = 0
                        blockBytes = ''
                        scCommands.push("FF B0 00 " + thisHexBlockNumber + " 10")
                      } else
                        byte++
                    }

                    if(byte < 16) {
                      for(var i=byte; i<16; i++) {
                        blockBytes += ' ' + (0).toString(16).toUpperCase().padStart(2, '0')
                      }
                      scCommands.push("FF B0 00 " + thisHexBlockNumber + " 10")
                    } else {
                      scCommands.push("FF B0 00 " + thisHexBlockNumber + " 10")
                    }

//                    reader.close()
//                    pcsc.close()
   
                      handleSCCommands(scCommands, protocol, keyLength)

//                      process.exit()
                    
                  })
                })
              }
            })
          }
        })
      }
    }
  })
})

//const keystore = require('./keystore.eh7.json')
//
//console.log(keystore)
