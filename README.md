# eh7-keystore

Tests and development ideas around storage of secret data.

## example commmands to create and recover keystore data....

node passPhraseSet.js password > keystore.eh7.00.json

node passPhraseGet.js password keystore.eh7.00.json

node passPhraseLoadOnSC.js keystore.eh7.00.json > keystore.eh7.00.dataload

// load keyfile onto Smart Card - this will change in the future to be done within passPhraseLoadOnSC.js
scriptor keystore.eh7.00.dataload

node passPhraseGetSC.js password

