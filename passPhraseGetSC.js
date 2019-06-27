
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

var pcsc = pcsc()

pcsc.on('reader', function(reader) {
  console.log('New reader detected', reader.name)


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
                  console.log('Data received', data)

                  // get binary data at block 04
                  reader.transmit(new Buffer.from([0xFF,0xB0,0x00,0x04,0x10]), 40, protocol, function(err, data) {
                    console.log('Data received', data)
     //               var keyLength = parseInt(data.toString('hex').substr(0,4), 16) 
                    var keyLength = data.toString('hex').substr(0,4) 

                    // get int data length
                    keyLength = parseInt(keyLength, 16)
                    console.log(keyLength)
   
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

                    console.log(bytes,blocks)
                    var byte = 0
                    for(var i=0; i<bytes; i++) {
                      thisHexBlockNumber = blockNumber.toString(16).toUpperCase().padStart(2, '0')
//                      console.log(i,byte)
                      console.log(sector,block,byte,thisHexBlockNumber)
                      if(byte === 0 && block === 0){
                      }
                      if(block === 2 && byte === 15){ 
                        blockNumber++
                        blockNumber++
                        block++
                        block++
                        sector++
                        byte = 0
                        block = 0
                      } else if(byte === 15){
                        blockNumber++
                        block++
                        byte = 0
                        blockBytes = ''
                      } else
                        byte++
                    }

                    if(byte < 16) {
                      for(var i=byte; i<16; i++) {
//                        blockBytes += ' ' + (0).toString(16).toUpperCase().padStart(2, '0')
                      }
//                      addKeystoreToSC += blockHeader + thisHexBlockNumber + " 10" + blockBytes + "\n"
//                      console.log(blockHeader + thisHexBlockNumber + " 10" + blockBytes)
                    } else {
//                      addKeystoreToSC += blockHeader + thisHexBlockNumber + " 10" + blockBytes + "\n"
//                      addKeystoreToSC += "FF B0 00 " + thisHexBlockNumber + " 10" + "\n"
//                      console.log(blockHeader + thisHexBlockNumber + " 10" + blockBytes)
//                      console.log("FF B0 00 " + thisHexBlockNumber + " 10")
                    }

                  // get binary data 05 to end
                    

//                    reader.close()
//                    pcsc.close()
                    process.exit()
                    
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
