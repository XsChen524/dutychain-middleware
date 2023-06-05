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
$ ./network.sh deployCC -ccn ledger -ccp ../chaincode/ledger/ -ccl javascript -ccep "OR('Org1MSP.peer','Org2MSP.peer')"
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

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org