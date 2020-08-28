const { Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "5748593139797cbf6357aa99fe14cb0678a6855cdb5e3ff1520e90ecbddbe32f"
);
const myWalletAddress = myKey.getPublic("hex");

let testBlockChain = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "address2", 10);
tx1.signTransaction(myKey);
testBlockChain.addTransaction(tx1);

console.log("\n Starting the miner...");
testBlockChain.minePendingTransactions(myWalletAddress);

console.log(
  "\n Balance of miner is",
  testBlockChain.getBalanceAddress(myWalletAddress)
);

// @vid4: https://www.youtube.com/watch?v=kWQ84S13-hw&list=PLzvRQMJ9HDiTqZmbtFisdXFxul5k0F-Q4&index=4
// in vid3 transactions and minig rewards had been added to the blockchain
// the problem is that anyone can make any thransaction that they want
// meaning they can spent coins that aren't theirs
// in vid4 functionality is implemented that makes it mandatory for transactions to be signed with a private and
// public key --> so user can only spent coin of a wallet if that user has the private key of it

// @vid4/keygenerator.js generate both keys
// class Transaction gets methods:
// calculateHash() --> its this hash that we are going to sign with our private key, meaning we are not going
// to sign all the data of the transaction -> only the hash() of the transaction
// signTransaction() --> will recieve a signing key so for signing a transaction this transaction is beeing
// given the users private/public key-pair
// signTransaction() method creates hash of the transaction(data which is fromAddress, toAddress and amount)
// then it creates a signatur which takes the signing key (const sig = signingKey.sign(hashTx, "base64");
// then the signature is beeing stored into this transaction
// if user want to transfer coins he/she passes the signingKey-object which has both private and public key
// said public key will then be compared to the from address of this transaction

// --> if (signingKey.getPublic("hex") === this.fromAddress) everything okay

// why? the signingKey-object has the users public key. it also has the users private key
// if the from address is equal to the public key in the signingKey-object then the user is the rightfull owner of
// the wallet because he obvoiusly has the private key too. Otherwhise the signingKey-object would be different.
// is associated to the public key (both are in the signingKey object) and hence the user owns the wallet he intents to send money from

// The private key is used to sign transactions. It proves that the owner of the wallet is taking money out of it.

// User creates transaction and then signs it. this signature is proof, that the fromAddress is realy his/hers
// i.e. user is owner of wallet
