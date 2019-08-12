const MongoClient = require('mongodb').MongoClient;
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(
    'https://kovan.infura.io/v3/2b9b40d981d14622a83634e1d5acffdc'
));

let db;
const setBlocks = async (latestIndex, db, client, cb) => {
    return new Promise(async resolve => {
        const blockCount = 40;
        for (let i = 0; i <= blockCount; i++) {
            let block = await web3.eth.getBlock(latestIndex - i);
            let blockObj = {
                blockHash: block.hash,
                transactions: block.transactions,
                blockNumber: block.number,
                index: i
            };
            let response = await db.collection('blocks').insertOne(blockObj);
            let newBlock = response.ops[0];
            console.log(newBlock);
            if (newBlock.transactions.length !== 0) {

                newBlock.transactions.forEach(async (txHash, index) => {
                    let tx = await web3.eth.getTransaction(txHash);

                    let txObject = {};
                    console.log(txHash)
                    txObject.txHash = txHash;
                    txObject.blockId = newBlock._id;
                    txObject.from = tx.from;
                    txObject.to = tx.to;
                    txObject.blockNumber = tx.blockNumber;
                    let response = await db.collection('transactions').insertOne(txObject);

                    if (i === blockCount && newBlock.transactions.length === index + 1) {
                        resolve(true)
                    }
                })
            } else {
                if (i === blockCount) {
                    resolve(true)
                }
            }
        }
    })

};


MongoClient.connect('mongodb://localhost:27017/block', async (err, client) => {
    if (err) throw err;

    db = client.db('matic');
    const latestBlock = await web3.eth.getBlock('latest');
    setBlocks(latestBlock.number, db, client).then(() => {
        console.log("***************indexing completed******************")
        client.close()
    })


});
