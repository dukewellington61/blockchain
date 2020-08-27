const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
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

    console.log("number of computations: " + this.nonce);

    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenisisBlock()];
    this.difficulty = 4;
  }

  createGenisisBlock() {
    return new Block(0, "01/02/2017", "Genisis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
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

// @ 1st video: creating a blockchain
// https://www.youtube.com/watch?v=zVqczFZr124&list=PLzvRQMJ9HDiTqZmbtFisdXFxul5k0F-Q4&index=1
testBlockChain.addBlock(new Block(1, "10/07/2017", { amount: 4 }));
testBlockChain.addBlock(new Block(2, "12/07/2017", { amount: 10 }));

console.log(JSON.stringify(testBlockChain, null, 4));

// case 1: no tampering with the blockchain
console.log("case 1: is blockchain valid? " + testBlockChain.isChainValid());

// case 2: tampering with the blockchain --> change data of block 2
testBlockChain.chain[1].data = { amount: 100 };
console.log("case 2: is blockchain valid? " + testBlockChain.isChainValid());

// case 3: tampering with the blockchain --> recalculate hash of block 2 based on changed data
testBlockChain.chain[1].hash = testBlockChain.chain[1].calculateHash();
console.log("case 3: is blockchain valid? " + testBlockChain.isChainValid());

// case 4: tampering with the blockchain:
//--> set previousHash of Block 3 to recalculated hash of Block 2 (after that block has been tampered with)
testBlockChain.chain[2].previousHash = testBlockChain.chain[1].hash;

//--> recalculate hash of block 3 based on changed previous hash
testBlockChain.chain[2].hash = testBlockChain.chain[2].calculateHash();
console.log("case 4: is blockchain valid? " + testBlockChain.isChainValid());

// @conclusion:
// case 4 shows how a blockchain can be compromised
// however, the proof of work as implemented in the bitcoin blockchain makes this impossible
// because it takes roughly 10 minutes to recalculate the hash of Block 3
// in order for the tampering to go unnoticed, every block after Block 2 had to be changed like in case 4
// this is impossible because new Blocks are beeing added to the blockchain every 10 minutes
// this means that the miner that does the tempering is always at least one block behind
// hence the control mechanism will always be able to spot the tampering
//
//
// @ 2nd video: implementing proof of work
// https://www.youtube.com/watch?v=HneatE69814&list=PLzvRQMJ9HDiTqZmbtFisdXFxul5k0F-Q4&index=1

// console.log("Mining block 1...");
// testBlockChain.addBlock(new Block(1, "10/07/2017", { amount: 4 }));

// console.log("Mining block 2...");
// testBlockChain.addBlock(new Block(2, "12/07/2017", { amount: 10 }));
