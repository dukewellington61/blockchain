const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    // console.log("number of computations: " + this.nonce);

    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenisisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenisisBlock() {
    return new Block("01/02/2017", "Genisis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    block.previousHash = this.getLatestBlock().hash;

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log("conditional 1");
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log("conditional 2");
        return false;
      }
    }
    return true;
  }
}

let testBlockChain = new Blockchain();

// @ 3rd video: mining reward & transactions
// https://www.youtube.com/watch?v=fRV6cGXVQ4I&list=PLzvRQMJ9HDiTqZmbtFisdXFxul5k0F-Q4&index=3

testBlockChain.createTransaction(new Transaction("address1", "address2", 100));
testBlockChain.createTransaction(new Transaction("address2", "address1", 50));

console.log("\n Starting the miner...");
testBlockChain.minePendingTransactions("miners-address");

console.log(
  "\n Balance of miner is",
  testBlockChain.getBalanceAddress("miners-address")
);

console.log("\n Starting the miner again...");
testBlockChain.minePendingTransactions("miners-address");

console.log(
  "\n Balance of miner is",
  testBlockChain.getBalanceAddress("miners-address")
);

// addition to vid1 & vid2
// Blocks can contain multiple transactions & reward for miners
// (mining rewards steadily introduce new coins into the system)
// Block class now has a property called transactions
// Transaction class has property fromAddress, toAddress and amount
// Blockchain class now has new properties: miningReward = 100, pendingTransactions = []
// the Blockchain class also recieves a createTransaction method which pushes transactions in the pending transactions array
// change mining method --> old: addBlock(newBlock), new: minePendingTransactions(miningRewardAddress)
// new method creates new Block which gets the pendingTransactions array
// in reality miners pick the transaction they want to include because not all the
// pending transactions can be added to one Block because block size is 1MB
// then mineBlock() is called and new Block is mined and pushed to the blockchain
// then pendingTransactions array is beeing reset
// then create new Transaction to give the miner the reward --> this is also a pending transaction
// so the pending transactions array is beeing emptied of all the pending transactions (that at this point has been mined)
// and the reward transaction is beeing put into the pending transactions array

// getBalanceAddress(address) --> method that checks the balance of an address --> balance is not stored anywhere, it has to be calculated based on the corresponding
// records in the blockchain
// two for of loops goes through every transaction in every Block of the blockchain and compares the address passed to this function
// with fromAddress and toAddress property in the transaction object
// --> if address equals fromAddress -> money is beeing substracted from the balance
// --> if address equals toAddress -> money is beeing added to the balance
