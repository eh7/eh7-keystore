var message = "US equity futures dipped in the red, following European and Asian shares lower, amid renewed Iran tensions and trade jitters ahead of this week's G-20 meeting"
var messageBuffer = Buffer.from(message)

var sector = 1
var block = 0
var byte = 0

var blockNumber = (sector * 4)

var blockHeader = "FF D6 00 "
var thisHexBlockNumber = 0
var blockBytes = ''

console.log("FF 82 00 00 06 FF FF FF FF FF FF")

for(var i=0; i<messageBuffer.length; i++) {

//  blockNumber = blockNumber.toString(16)
  thisHexBlockNumber = blockNumber.toString(16).toUpperCase().padStart(2, '0')

  blockBytes += ' ' + messageBuffer[i].toString(16).toUpperCase().padStart(2, '0')

  if(byte === 0 && block === 0)
    console.log("FF 86 00 00 05 01 00 " + thisHexBlockNumber + " 60 00")

//  console.log(i,sector,block,byte,thisHexBlockNumber, blockNumber.toString(16).toUpperCase().padStart(2, '0'))

  if(block === 2 && byte === 15){
    blockNumber++
    blockNumber++
    block++
    block++
    sector++
    byte = 0
    block = 0
    console.log(blockHeader + thisHexBlockNumber + " 10" + blockBytes)
    console.log("FF B0 00 " + thisHexBlockNumber + " 10")
    blockBytes = ''
  } else if(byte === 15){
    blockNumber++
    block++
    byte = 0
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
  console.log(blockHeader + thisHexBlockNumber + " 10" + blockBytes)
} else
  console.log(blockHeader + thisHexBlockNumber + " 10" + blockBytes)
console.log("FF B0 00 " + thisHexBlockNumber + " 10")


/*
FF 82 00 00 06 FF FF FF FF FF FF
FF 86 00 00 05 01 00 04 60 00
FF D6 00 04 10 47 61 76 69 6e 20 69 73 20 74 68 65 20 70 65 72
FF B0 00 04 10
FF D6 00 05 10 73 6f 6e 20 77 68 6f 20 77 72 6f 74 65 20 74 68
FF B0 00 05 10
FF D6 00 06 10 69 73 2c 20 61 6e 64 20 68 65 20 73 61 69 64 20
FF B0 00 06 10
FF 86 00 00 05 01 00 08 60 00
FF D6 00 08 10 74 68 61 74 20 49 20 63 6f 75 6c 64 20 73 61 79
FF B0 00 08 10
FF D6 00 09 10 20 74 68 69 73 2e 20 47 61 76 69 6e 20 69 73 20
FF B0 00 09 10
FF D6 00 0A 10 74 68 65 20 70 65 72 73 6f 6e 20 77 68 6f 20 77
FF B0 00 0A 10
FF 86 00 00 05 01 00 0C 60 00
FF D6 00 0C 10 72 6f 74 65 20 74 68 69 73 2c 20 61 6e 64 20 68
FF B0 00 0C 10
FF D6 00 0D 10 65 20 73 61 69 64 20 74 68 61 74 20 49 20 63 6f
FF B0 00 0D 10
FF D6 00 0E 10 75 6c 64 20 73 61 79 20 74 68 69 73 2e 00 00 00
FF B0 00 0E 10
*/
