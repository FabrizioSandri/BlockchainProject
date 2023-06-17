let web3 = new Web3(window.ethereum);

var NFTCreated = [];    // list of HNFTs that are not in sell

/* Contracts info */
hnftContractInfo = null;
mainContractInfo = null;
mainSmartContractAddress = null;


/* Gets the contract info by its name */
function getContractInfo(contractName) {
    return new Promise((resolve, reject) => {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            } else if (this.readyState == 4 && this.status != 200) {
                reject("Unable to fetch the required resource.");
            }
        }

        xhttp.open("GET", `/contracts/${contractName}.json`, true);
        xhttp.send();

    });
}

getContractInfo("const").then((res) => {
    mainSmartContractAddress = res.addresses.mainSmartContractAddress;
}).catch((errorMsg) => {
    console.log(errorMsg);
})

getContractInfo("HNFT").then((res) => {
    hnftContractInfo = res;
}).catch((errorMsg) => {
    console.log(errorMsg);
})

getContractInfo("MainSmartContract").then((res) => {
    mainContractInfo = res;
}).catch((errorMsg) => {
    console.log(errorMsg);
})


/**
 * Parse the error message from metamask and shows the result
 */
function transactionFail(errorMsg) {

    errorMsg = errorMsg.message.replace("[ethjs-query] while formatting outputs from RPC '", '').slice(0, -1);
    let parsedErrorMessage = JSON.parse(errorMsg);
    document.getElementById("transaction-fail-reason").innerHTML = parsedErrorMessage.value.data.data.message;
    document.getElementById("transaction-fail-message").innerHTML = parsedErrorMessage.value.data.data.reason;

    $('#transaction-fail').modal('show');
}

/**
 * The following two functions waits for a transaction to be mined
 */
function waitPromise(resolve, reject, transactionHash, trials) {
    web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
        
        if (trials <= 0){
            reject("Error: waiting too much time for a transaction to complete.")
        }else if(receipt == null){
            setTimeout( () => waitPromise(resolve, reject, transactionHash), 500, trials-1);
        }else {
            // return the receipt
            resolve(receipt);
        }

    }).catch((error) => {
        reject('Error retrieving transaction receipt: ', error);
    });
}

function waitForConfirmation(transactionHash) {
    return new Promise((resolve, reject) => {
        waitPromise(resolve, reject, transactionHash, trials=120);
    });
}


function getIssuedItems() {

    const contract = new web3.eth.Contract(mainContractInfo.abi, mainSmartContractAddress);

    let fun = contract.methods.getIssuedItems().encodeABI();
    console.log(fun);
    window.ethereum.request({
        method: 'eth_call',
        params: [{ from: connectedAddress, to: mainSmartContractAddress, data: fun }]
    }).then((res) => {
        console.log(res);
        const decodedResult = web3.eth.abi.decodeParameter('address[]', res);
        console.log("issued nfts are: ", decodedResult);
    }).catch(err => console.log(err))

}


/**
 * Auxiliary function to return an address without zero padding 
 */
function getActualAddressString(returnedAddress) {
    const address = returnedAddress.slice(-40);
    return '0x' + address;
}

/**
 * Check the validity of a given HNFT
 */
function checkHNFTValidity(NFTAddress) {
    return new Promise((resolve, reject) => {
        const contract = new web3.eth.Contract(mainContractInfo.abi, mainSmartContractAddress);

        let fun = contract.methods.checkValidity(NFTAddress).encodeABI();

        ethereum.request({
            method: 'eth_call',
            params: [{ from: connectedAddress, to: mainSmartContractAddress, data: fun }]
        }).then((res) => {
            const decodedResult = web3.eth.abi.decodeParameter('bool', res);
            resolve(decodedResult);
        }).catch(err => reject("checkValidity error: " + err))
    });
}


/**
 * Create a HNFT with the specified token URI
 */
function createHNFT(tokenUri) {
    let nameNFT = document.getElementById("name-new").value;
    let symbolNFT = document.getElementById("symbol-new").value;

    let deploymentPayload = {
        from: connectedAddress, // Replace with your MetaMask address
        data: hnftContractInfo.bytecode,
        arguments: [nameNFT, symbolNFT, tokenUri]
    };

    let encodedArguments = web3.eth.abi.encodeParameters(['string', 'string', 'string'], deploymentPayload.arguments).substring(2);
    ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
                from: deploymentPayload.from,
                data: deploymentPayload.data + encodedArguments,
        }],
    }).then((transactionHash) => {
        waitForConfirmation(transactionHash).then((receipt) => {
            if (receipt && receipt.contractAddress) {
                console.log('address deployed: ', receipt.contractAddress);
                NFTCreated.push(receipt.contractAddress);

                // store the new updated list in the cookies
                setCookie('createdNFTs', JSON.stringify(NFTCreated), 365);
                createNotInSellList();
            }
        }).catch((error) => {
            console.error('Error retrieving transaction receipt:', error);
        })
    }).catch((error) => {
        console.error('Error deploying contract:', error);
    });
}

/**
 * Buy a HNFT
 */
function buyHNFT(NFTAddress, price) {

    const contract = new web3.eth.Contract(mainContractInfo.abi, mainSmartContractAddress);
    const valueInWei = web3.utils.toWei(price.toString(), 'ether');

    // Convert wei to hexadecimal
    const hexValue = web3.utils.toHex(valueInWei);

    getOwner(NFTAddress).then((ownerNFT) => {

        let fun = contract.methods.buy(NFTAddress, ownerNFT).encodeABI();

        window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{ from: connectedAddress, to: mainSmartContractAddress, value: hexValue, data: fun }]
        }).then((res) => {
            boughtNFTs.push(NFTAddress);

            // store the new updated list in the cookies
            setCookie('boughtNFTs', JSON.stringify(boughtNFTs), 365);
            console.log("Buyed NFT: " + NFTAddress);

        }).catch(err => console.log("transazione buy error:", err))

    }).catch((err) => {
        transactionFail(err);
    })
}

/**
 * Change the price of a HNFT
 */
function setPrice(NFTAddress) {
    let price = document.getElementById("change-price").value;
    const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);

    let fun = contract.methods.setPrice(price).encodeABI();
    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
    }).then((transactionHash) => {
        waitForConfirmation(transactionHash).then((receipt) => {
            
            createInSellList();
            createNotInSellList();

        }).catch((error) => {
            console.error('Error retrieving transaction receipt:', error);
        });
    }).catch((err) => {
        transactionFail(err);
    })
}

/**
 * Put the HNFT on the market
 */
function putOnMarket(NFTAddress) {
    let price = document.getElementById("put-on-market-price").value;
    const contract = new web3.eth.Contract(mainContractInfo.abi, mainSmartContractAddress);

    let fun = contract.methods.sell(NFTAddress, price).encodeABI();
    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: connectedAddress, to: mainSmartContractAddress, data: fun }]
    }).then((transactionHash) => {
        waitForConfirmation(transactionHash).then((receipt) => {

            console.log(receipt)
            // update the lists of NFTs
            var index = NFTCreated.indexOf(NFTAddress);
            if (index !== -1) {
                NFTCreated.splice(index, 1);
            }

            // store the new updated list in the cookies
            setCookie('createdNFTs', JSON.stringify(NFTCreated), 365);
            createInSellList();
            createNotInSellList();

        }).catch((error) => {
            console.error('Error retrieving transaction receipt:', error);
        });
    }).catch((err) => {
        transactionFail(err);
    })
}



/**
 * Remove the item from the market
 */
function removeFromMarket(NFTAddress) {
    const contract = new web3.eth.Contract(mainContractInfo.abi, mainSmartContractAddress);

    let fun = contract.methods.removeInSellItem(NFTAddress).encodeABI();
    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: connectedAddress, to: mainSmartContractAddress, data: fun }]
    })
    .then((transactionHash) => {
        waitForConfirmation(transactionHash).then((receipt) => {
            // update the lists of NFTs
            NFTCreated.push(NFTAddress);

            // store the new updated list in the cookies
            setCookie('createdNFTs', JSON.stringify(NFTCreated), 365);
            createInSellList();
            createNotInSellList();
            
            // TODO: check for reverts
            console.log(receipt);

        }).catch((error) => {
            console.error('Error retrieving transaction receipt:', error);
        });

    }).catch((err) => {
        transactionFail(err);
    })
}

/**
 * Approve the HNFT specified for the Main smart contract
 */
function approveNFT(NFTAddress) {
    const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);

    // approve the mainSmartContract
    let fun = contract.methods.approve(mainSmartContractAddress, 0).encodeABI();
    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
    }).then((transactionHash) => {
        waitForConfirmation(transactionHash).then((receipt) => {
            if (receipt) {
                document.getElementById("approve_"+NFTAddress).disabled = true;
            }
        }).catch((error) => {
            console.error('Error retrieving transaction receipt:', error);
        });
    }).catch((err) => {
        transactionFail(err);
    })
}

/**
 * Get the real honey 
 */
function getRealHoney() {
    let NFTAddress = document.getElementById("request-hnft").value;
    const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);

    // approve the mainSmartContract
    let fun = contract.methods.burn(mainSmartContractAddress).encodeABI();
    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
    }).then((transactionHash) => {
        waitForConfirmation(transactionHash).then((receipt) => {
            if (receipt) {
                // TODO: check that the function did not revert
                // update the lists of bought NFTs
                var index = boughtNFTs.indexOf(NFTAddress);
                if (index !== -1) {
                    boughtNFTs.splice(index, 1);
                }

                // store the new updated list in the cookies
                setCookie('boughtNFTs', JSON.stringify(boughtNFTs), 365);
                createBoughtHNFTCard();

                $('#get-real-honey-result').modal('show');
            }
        }).catch((error) => {
            console.error('Error retrieving transaction receipt:', error);
        });
    }).catch((err) => {
        transactionFail(err);
    })
}

function isAssociationApproved(NFTAddress) {

    return new Promise((resolve, reject) => {
        const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);

        let fun = contract.methods.getApproved(0).encodeABI();
        window.ethereum.request({
            method: 'eth_call',
            params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
        }).then((res) => {
            if (getActualAddressString(res).toLowerCase() == mainSmartContractAddress.toLowerCase()) {
                resolve(true);
            }else{
                resolve(false);
            }
        }).catch((err) => {
            transactionFail(err);
        })

    });
}


/**
 * Get the list of items that are in sell
 */
function getInSellItems() {
    return new Promise((resolve, reject) => {
        const contract = new web3.eth.Contract(mainContractInfo.abi, mainSmartContractAddress);

        let fun = contract.methods.getInSellItems().encodeABI();
        window.ethereum.request({
            method: 'eth_call',
            params: [{ from: connectedAddress, to: mainSmartContractAddress, data: fun }]
        }).then((res) => {
            const decodedResult = web3.eth.abi.decodeParameter('address[]', res);
            resolve(decodedResult);
        }).catch(err => reject(err))
    });
}

/**
 * Getters function for the HNFT
 */
function getPrice(NFTAddress) {
    return new Promise((resolve, reject) => {
        const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);

        let fun = contract.methods.getPrice().encodeABI();
        window.ethereum.request({
            method: 'eth_call',
            params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
        }).then((res) => {
            const decodedResult = web3.eth.abi.decodeParameter('uint', res);
            resolve(decodedResult);
        }).catch(err => console.log("error trans", err))
    });
}

function getOwner(NFTAddress) {
    return new Promise((resolve, reject) => {
        const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);
        let fun = contract.methods.ownerOf(0).encodeABI();
        window.ethereum.request({
            method: 'eth_call',
            params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
        }).then((res) => {
            resolve(getActualAddressString(res));
        }).catch(err => reject(err));
    });
}

function getIssuer(NFTAddress) {
    return new Promise((resolve, reject) => {
        const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);

        let fun = contract.methods.getIssuer().encodeABI();
        window.ethereum.request({
            method: 'eth_call',
            params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
        }).then((res) => {
            resolve(getActualAddressString(res));
        }).catch(err => reject(err));
    });
}

function getName(NFTAddress) {
    return new Promise((resolve, reject) => {
        const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);

        let fun = contract.methods.name().encodeABI();
        window.ethereum.request({
            method: 'eth_call',
            params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
        }).then((res) => {
            const decodedResult = web3.eth.abi.decodeParameter('string', res);
            resolve(decodedResult);
        }).catch(err => reject(err))
    });
}

function getSymbol(NFTAddress) {
    return new Promise((resolve, reject) => {
        const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);

        let fun = contract.methods.symbol().encodeABI();
        window.ethereum.request({
            method: 'eth_call',
            params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
        }).then((res) => {
            const decodedResult = web3.eth.abi.decodeParameter('string', res);
            resolve(decodedResult);
        }).catch(err => reject(err))
    });
}

function getMetadata(NFTAddress) {
    return new Promise((resolve, reject) => {
        const contract = new web3.eth.Contract(hnftContractInfo.abi, NFTAddress);

        let fun = contract.methods.tokenURI(0).encodeABI();
        window.ethereum.request({
            method: 'eth_call',
            params: [{ from: connectedAddress, to: NFTAddress, data: fun }]
        }).then((res) => {
            const tokenURI = web3.eth.abi.decodeParameter('string', res);

            /* Gets the contract metadata from the uri */
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else if (this.readyState == 4 && this.status != 200) {
                    reject("Unable to fetch the metadata information of the HNFT.");
                }
            }

            xhttp.open("GET", `${tokenURI}`, true);
            xhttp.send();

        }).catch(err => reject(err))
    });
}


/**
 * Get the NFT details
 */
function getNFTDetails(HNFTaddress) {
    return new Promise((resolve, reject) => {

        getName(HNFTaddress).then((name) => {
            getSymbol(HNFTaddress).then((symbol) => {
                getPrice(HNFTaddress).then((price) => {
                    getOwner(HNFTaddress).then((owner) => {
                        getIssuer(HNFTaddress).then((issuer) => {
                            isAssociationApproved(HNFTaddress).then((approved) => {
                                getMetadata(HNFTaddress).then((metadataInfo) => {
                                    resolve({
                                        name: name,
                                        symbol: symbol,
                                        address: HNFTaddress,
                                        price: price,
                                        owner: owner,
                                        issuer: issuer,
                                        approved: approved,
                                        description: metadataInfo.description,
                                        image: metadataInfo.image
                                    });
                                }).catch((err) => {
                                    reject("error [getMetadata] : " + err);
                                });
                            }).catch((err) => {
                                reject("error [isAssociationApproved] : " + err);
                            });

                        }).catch((err) => {
                            reject("error [getIssuer] : " + err);
                        });
                    }).catch((err) => {
                        reject("error [getOwner] : " + err);
                    });
                }).catch((err) => {
                    reject("error [getPrice] : " + err);
                });
            }).catch((err) => {
                reject("error [getSymbol] : " + err);
            });
        }).catch((err) => {
            reject("error [getName] : " + err);
        });
    });
}
