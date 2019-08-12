const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const path = require('path');
const Web3 = require('web3');
const MongoClient = require('mongodb').MongoClient;
const web3 = new Web3(new Web3.providers.HttpProvider(
    'https://kovan.infura.io/v3/2b9b40d981d14622a83634e1d5acffdc'
));


let db;
const getBlocks = async (latestIndex, db) => {
    for (let i = 0; i <= 3; i++) {
        await web3.eth.getBlock(latestIndex - i).then(block => {
            let blockObj = {
                blockHash: block.hash,
                transactions: block.transactions,
                blockNumber: block.number,
                index: i
            };
            console.log(blockObj);
            db.collection('blocks').insertOne(blockObj, () => {
                console.log(block.number, 'added to db')
            })
        })

    }
};
MongoClient.connect('mongodb://localhost:27017/block', function (err, client) {
    if (err) throw err;

    db = client.db('blocks');
    web3.eth.getBlock('latest').then((latestBlock) => {


        console.log("starting to index blocks");
        getBlocks(latestBlock.number, db).then(() => {
            console.log("indexing completed");
            app.listen(3000, () => {
                console.log("'app now listening on port 3000'")
            });
        })
    })

});


// db.collection('blocks').insertOne({name: "pranav singhal2"}, function () {
//     db.collection('blocks').find().toArray(function (err, result) {
//         if (err) throw err;
//         console.log("inside blocks");
//         console.log(result);
//
//     })
// })

// web3.eth.getBlock('latest').then(console.log);


// get latest block's block number
// find the latest block
// save its number
// for latest block to latest minus 10000 blocks
// get transactions of each block
// save each transaction's from to and transactionHash
// create an api end point to query blocks
// query according to blockNumber
// query according to numberOfLatestBlocks


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));

});


app.get('/getBlockByNumber/:blockNumber', function (req, response) {
    req.params.blockNumber = parseInt(req.params.blockNumber);
    console.log(req.params);
    db.collection('blocks').findOne(req.params, function (err, res) {
        console.log(res);
        response.send(res)
    })
});

app.get('/getBlockByHash/:blockHash', function (req, response) {

    db.collection('blocks').findOne(req.params, function (err, res) {

        response.send(res);
    })

});



app.get('/getTransactionData/:txHash',function (req,response) {
    web3.eth.getTransaction(req.params.txHash).then(tx => {
        // console.log(tx);
        let resObj  ={};
        resObj.txHash = req.params.txHash;
        resObj.from = tx.from;
        resObj.to = tx.to;
        resObj.blockNumber = tx.blockNumber;
        response.send(resObj);


    })
})


