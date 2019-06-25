var scrypt = require("scrypt")

var scryptParameters = scrypt.paramsSync(1)

var key = Buffer.from("testpassword")

var output_length = 16

var salt = "salty sea dogs"

var hash = scrypt.hashSync(key, scryptParameters, output_length, salt)

