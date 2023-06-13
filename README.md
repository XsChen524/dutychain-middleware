# dutychain-middleware



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy Middleware

```bash
$ npm start
$ npm stop
```

### Start Hyperledger Network
* network logs are located at ~/logs
```bash
$ cd hyperledger/test-network
$ ./network.sh up createChannel -c mychannel -s couchdb -ca
$ ./network.sh deployCC -ccn ledger -ccp ../chaincode/ledger-doctype/ -ccl javascript -ccep "OR('Org1MSP.peer','Org2MSP.peer')"
```

### CleanUps
```bash
# clean up logs
$ cd ~/logs
$ rm -rf *

# clean up hyperledger network
$ cd hyperledger/test-network
$ ./network.sh down

$ cd app/blockchain
$ rm -rf wallet
```


## APIs

### init
initialize the ledger, must call this first before calling any other API

<B>No parameters are required</B>

Example:
```bash
$ curl --header "Content-Type: application/json" --request POST localhost:7001/debug/init
```
<img src="img/debug.png">

### readall
Get all assets in the network

<B>No paramters are required</B>

Example:
```bash
curl --header "Content-Type: application/json" --request POST localhost:7001/debug/readall
```
<img src="img/readall.png">

### create
add an asset to the hyperledger network

<B>required to have the following fields in the input JSON:</B>
* id: string
* type: string
* data: JSON

Example:
<img src="img/create.png">

### read
Get the asset with the given ID in the network

<B>required to have the following fields in the input JSON:</B>
* id: string

Example:
```bash
curl --header "Content-Type: application/json" --request POST --data '{"id":"1"}'  localhost:7001/debug/read
```
<img src="img/read.png">


### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org