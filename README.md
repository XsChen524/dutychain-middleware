# dutychain-middleware

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

# Steps

## Install Hyperledger Network

```
git clone https://github.com/makhead/dutychain-backend.git
```

## Start Hyperledger Network

Detailed Step can be viewed at https://github.com/makhead/dutychain-backend

### 1. Setup config.json

### 2. Generate Docker config files

```bash
$ ./configFile-generate.sh ./config.json
```

### 3. Setup configtx/configtx.yaml

### 4. Setup compose/compose-test-net.yaml

-   modify the volume part
-   modify the depends_on part

### 5. Start the network

```bash
$ ./network.sh up createChannel -c mychannel -s couchdb -ca -p ./config.json
```

### 6. Deploy Chaincode

Please modify the policy (-ccep option) to situable policy

```bash
$ ./network.sh deployCC -c mychannel -ccn ledger -ccp ../chaincode/ledger-doctype/ -ccl javascript -p ./config.json -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')"
```

## Start middleware

### 1. Set up connection profile (ccp)

Copy the ccp of all organizations in dutychain-backend/hyperledger/test-network/organizations/peerorganizations/_Org name_/ to directory <B>dutychain-middle/app/ccp</B>

### 2. Generate Public Private RSA Key Pair

Generate the key pair for each organization for initial admin account password encrytion

```bash
$ cd app/pubKeys
$ ./generateKey.sh 1
$ ./generateKey.sh 2
$ ./generateKey.sh 3
```

### 3. Set up config.json

set up config.json in directory dutychain-middle/app/pubKeys/

### 4. Start middleware

```bash
$ npm start
```

# CleanUps

## backend

```bash
./network.sh down -p ./config.json
```

## middleware

```bash
# clean up logs
$ cd ~/logs
$ rm -rf *

# clean up wallets
$ cd app/blockchain
$ rm -rf wallet

# clean up admin initialize account passwords
$ cd app/blockchain
$ rm adminInfo.json

# clean up admin initialize account passwords
$ cd app/pubKeys
$ ./clearKey.sh

# drop database schema
$ mongosh
$ use db_egg
$ db.dropDatabase()
```

## APIs

### init

initialize the ledger, before using blockchain, must call this first before calling any other API

<B>No parameters are required</B>

Example:

```bash
$ curl --header "Content-Type: application/json" --request POST localhost:7001/debug/init
```

### npm scripts

-   Use `npm run lint` to check code style.
-   Use `npm test` to run unit test.
-   Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org
