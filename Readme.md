
#Instructions

## 1. Index database

To index the last 10,000 blocks, run 

`node database.js`


**NOTE**

> Make sure you have mongodb running on port 27017 first



## 2. Start API server

To start the api server, run

1. `yarn install`
2. `node index.js`



## Api Endpoints


### Get
* `getBlockNumber/:blockNumber`

parameter: block number of the block that you want to fetch the data of

* `getBlockByHash/:blockHash`

parameter: hash of the block that you want to fetch the data of

* `getTransactionData/:txHash`

parameter: hash of the transaction you want to fetch the information for

* `getUserTransactions/:userAddress`

parameter: user address whose transactions you want to see    


## Dependencies

* Node Version: `v10.16.0`
* mongodb version: `v4.0.12`
* web3 version: `^1.2.1`
