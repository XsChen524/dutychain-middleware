# hyperledger network

## Run the application

### create channel
```
./network.sh up createChannel -c mychannel -s couchdb -ca
```

### deploy smart contract
```
./network.sh deployCC -ccn ledger -ccp ../chaincode/ledger/ -ccl javascript -ccep "OR('Org1MSP.peer','Org2MSP.peer')"
```

### view peer log
```
docker logs peer0.org1.example.com  2>&1 | grep "CouchDB index"
```

### view components in test network
```
docker ps -a
```

## cleanup
shutdown hyperledger node
```
cd test-network
./network down
```

remove local wallet
```
cd app/blockchain/
rm -rf wallet
```


# APIs

## init
must call this first before calling any other API



## create

##