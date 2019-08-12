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
MongoClient.connect('mongodb://localhost:27017/block', async (err, client) => {
    if (err) throw err;
    db = client.db('matic');
});



app.listen(3000,()=>{
    console.log("app listening on 3000")
})

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


app.get('/getTransactionData/:txHash', function (req, response) {
    web3.eth.getTransaction(req.params.txHash).then(tx => {
        // console.log(tx);
        let resObj = {};
        resObj.txHash = req.params.txHash;
        resObj.from = tx.from;
        resObj.to = tx.to;
        resObj.blockNumber = tx.blockNumber;
        response.send(resObj);


    })
});


app.get('/getUserTransactions/:userAddress', function (req, response) {

    const userAddress = req.params.userAddress;

    db.collection('transactions').find({from : userAddress}).toArray((err, result)=> {
        console.log(result)
        let responseObj = {}
        responseObj.userTransactions = result;
        response.send(responseObj)
    })

});



