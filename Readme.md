## Api Endpoints


### Get
* `getBlockNumber/:blockNumber`

* `getBlockByHash/:blockHash`
* `getTransactionData/:txHash`
* `getUserTransactions/:userAddress`  



## Index database

To index the last 10,000 blocks, run 

`node database.js`


**NOTE**

> Make sure you have mongodb running on port 27017 first



##Start API server

To start the api server, run

1. `yarn install`
2. `node index.js`


## Dependencies

* Node Version: `v10.16.0`
* mongodb version: `v4.0.12`
* web3 version: `^1.2.1`
