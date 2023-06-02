let web3 = new Web3("http://127.0.0.1:7545");

var deployedNFTAdddress;
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




function checkHNFTValidity() {
    const checkValidityAddress = document.getElementById("nftAddressInteract").value;

    const contract = new web3.eth.Contract(mainContractInfo.abi, mainSmartContractAddress);

    let fun = contract.methods.CheckValidity(checkValidityAddress).encodeABI();

    ethereum.request({
        method: 'eth_call',
        params: [{ from: connectedAddress, to: mainSmartContractAddress, data: fun }]
    }).then((res) => {
        console.log(res);
        const decodedResult = web3.eth.abi.decodeParameter('bool', res);
        if (decodedResult) {
            console.log("the nft is verified");
        }
        else {
            console.error("NFT NOT VERIFIED!");
        }
    }).catch(err => console.log("error trans", err))
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

function getActualAddressString(returnedAddress) {
    const address = returnedAddress.slice(-40);
    return '0x' + address;
}


/**
 * Create a HNFT
 */
function createHNFT() {
    let nameNFT = document.getElementById("name-new").value;
    let symbolNFT = document.getElementById("symbol-new").value;

    let deploymentPayload = {
        from: connectedAddress, // Replace with your MetaMask address
        data: hnftContractInfo.bytecode,
        arguments: [nameNFT, symbolNFT]
    };

    let encodedArguments = web3.eth.abi.encodeParameters(['string', 'string'], deploymentPayload.arguments).substring(2);
    ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
                from: deploymentPayload.from,
                data: deploymentPayload.data + encodedArguments,
        }],
    }).then((transactionHash) => {
        web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
                if (receipt && receipt.contractAddress) {
                    deployedNFTAdddress = receipt.contractAddress;
                    console.log('address deployed: ', receipt.contractAddress);
                    NFTCreated.push(deployedNFTAdddress);

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
            console.log("transazione buy andata a buon fine: ", res)
        }).catch(err => console.log("transazione buy error:", err))

    }).catch((err) => console.log(err));
}

/**
 * Change the price of a HNFT
 */
function setPrice(NFTAddress) {
    let price = document.getElementById("change-price").value;
    const contract = new web3.eth.Contract(mainContractInfo.abi, mainSmartContractAddress);

    let fun = contract.methods.setPrice(NFTAddress, price).encodeABI();
    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: connectedAddress, to: mainSmartContractAddress, data: fun }]
    })
    .then((transactionHash) => {
        web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
            
            createInSellList();
            createNotInSellList();

        }).catch((error) => {
            console.error('Error retrieving transaction receipt:', error);
        });
    })
    .catch(err => console.log("transazione setprice error:", err))
}

/**
 * Burn the token
 */
function burnToken(NFTAddress) {

    const contract = new web3.eth.Contract(mainContractInfo.abi, mainSmartContractAddress);

    let fun = contract.methods.burn(NFTAddress).encodeABI();
    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: connectedAddress, to: mainSmartContractAddress, data: fun }]
    }).then((transactionHash) => {

        const returnStatus = web3.eth.abi.decodeParameter("bool", transactionHash);
        web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {

            if (returnStatus == true){
                // update the lists of NFTs
                var index = NFTCreated.indexOf(NFTAddress);
                if (index !== -1) {
                    NFTCreated.splice(index, 1);
                }

                // store the new updated list in the cookies
                setCookie('createdNFTs', JSON.stringify(NFTCreated), 365);
                createInSellList();
                createNotInSellList();

            }

        }).catch((error) => {
            console.error('Error retrieving transaction receipt:', error);
        });
    }).catch(err => console.log("error trans", err))
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
    })
    .then((transactionHash) => {
        web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
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
    })
    .catch(err => console.log("transazione setprice error:", err))
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
        web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
            if (receipt) {
                document.getElementById("approve_"+NFTAddress).disabled = true;
            }
        }).catch((error) => {
            console.error('Error retrieving transaction receipt:', error);
        });
    }).catch(err => console.log("error approve", err))
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
        }).catch(err => console.log("error trans", err))

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
                        
                            resolve({
                                name: name,
                                symbol: symbol,
                                address: HNFTaddress,
                                price: price,
                                owner: owner,
                                issuer: issuer
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