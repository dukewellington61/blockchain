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

console.log("Is chain valid?", testBlockChain.isChainValid());

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

// @Transaction class -> new method @signTransaction() method

// --> if (signingKey.getPublic("hex") === this.fromAddress) everything okay
// why? the signingKey-object has the users public key. it also has the users private key
// if fromAddress is equal to the public key in the signingKey-object then the user is the rightfull owner of
// the wallet because he obviously has the private key too. Otherwhise the signingKey-object would be different.

// creates hash of the transaction data which is fromAddress, toAddress and amount

// signature object is beeing created from private key stored in signingKey-object and afore mentioned hash
// const sig = signingKey.sign(hashTx, "base64");
// this.signature = sig.toDER("hex");

// @Transaction class -> @isValid() --> verifies if the transaction has been correctly signed
// has to take into account mining rewards - they are transactions but they don't come from a wallet hence fromAddress === null
// but they still have to be valid
// checks if the transaction was signed with the correct key --> meaning with the signature of the owner of the wallet
// const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
// return publicKey.verify(this.calculateHash(), this.signature);
// creates publicKey-object from fromAddress
// uses verify method of said object to check if the public key belongs to the private key which is encrypted in the signature

// @Block class -> new method -> hasValidTransactions() --> loops through all the transactions in a block
// and calls isValid() to verify them

// @Blockchain class -> isChainValid()
// if (!currentBlock.hasValidTransactions()) {
//  return false;
// }
// goes through the blockschain and checks if all the transactions in the blocks are valid

// @Blockchain class -> createTransaction() --> change to addTransaction()
// does a few checks, then pushes transaction to the pendingTransactions array
