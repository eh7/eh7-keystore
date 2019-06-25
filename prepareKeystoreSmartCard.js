const keystore = {"address":"d9b29ba6b16b2967f6c8ec9ccc3b6d3d3431f82d","crypto":{"cipher":"aes-128-ctr","ciphertext":"eb301e7207badb407036c4544ac04bfaf0dd3c67ac35cd0e44955f8f76f7d049","cipherparams":{"iv":"79220dc34ef76f6ebc0f2882db4e5787"},"mac":"4d11928d266e16819fd63a9ffe7208f13de21393fe37b3903169e8a3e26606c1","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"e67d7ff3e36bbaf6ad1e6ecf2fb09c78a7e06ccb1875970cd8a0d5ce1e1d76fd"}},"id":"95cbc4a8-1ef6-474e-ad36-ebf71b5d8c9e","version":3}

var keystoreString = Buffer.from(JSON.stringify(keystore))

var keystoreBlocks = keystoreString.toString().match(/(.{1,8})/g)
var keystoreChars = keystoreString.toString()//.match(/(.{1})/g)

console.log(keystoreBlocks)
for (var i = 0; i < keystoreChars.length; i++) {
  var c = keystoreChars.charCodeAt(i)
  if (c >= 128) {
    console.log(i,keystoreChars.charCodeAt(i))
  } else {
    console.log(keystoreChars.charCodeAt(i))
  }
}
