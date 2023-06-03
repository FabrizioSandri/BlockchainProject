const web3 = require('web3');
const mainSmartContract = artifacts.require("MainSmartContract");
const HNFTContract = artifacts.require("HNFT");

contract("MainSmartContract/HNFT tests", (accounts) => {


    it("HNFT issuer should be the creator of the HNFT it self", async () => {
        let issuer = accounts[1];
        try {
            let HNFTInstance = await HNFTContract.new("TEST", "TST", { from: issuer });
            let res = await HNFTInstance.getIssuer();
            assert.equal(issuer, res, "the main smart contract could not do the transfer");
        } catch (error) {
            assert.fail("Unexpected Error");
        }
    });

    it("trying to burn a token not on the market", async () => {
        let randomAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
        try {
            const mainSmartContractInstance = await mainSmartContract.deployed();
            let res = await mainSmartContractInstance.burn(randomAddress);
        } catch (err) {
            assert(err.message.includes("The NFT does not exists in the sell market"), "Unexpected error message");
        }
    });

    it("MainSmartContract should get a true when checking of the validity of a HNFT", async () => {
        let issuer = accounts[1];
        let value = 3;
        try {
            const mainSmartContractInstance = await mainSmartContract.deployed();
            const mainSmartContractAddress = mainSmartContractInstance.address;
            let HNFTInstance = await HNFTContract.new("TEST", "TST", { from: issuer });
            // check validity of an HNFT
            let res = await HNFTInstance.approve(mainSmartContractAddress, 0, { from: issuer });
            res = await mainSmartContractInstance.sell(HNFTInstance.address, value, { from: issuer });
            res = await mainSmartContractInstance.CheckValidity(HNFTInstance.address, { from: issuer });
            assert.strictEqual(res, true, 'Value should be true');
        } catch (error) {
            assert.fail("Unexpected Error");
        }
    });

    it("MainSmartContract should not set the price if it is not approved", async () => {
        let issuer = accounts[1];
        let thirdPartyAccount = accounts[2];
        let value = 3;
        try {
            const mainSmartContractInstance = await mainSmartContract.deployed();
            let HNFTInstance = await HNFTContract.new("TEST", "TST", { from: issuer });
            // Attempt to set Price from MainSmartContract without approval
            let res = await mainSmartContractInstance.setPrice(HNFTInstance.address, value, { from: thirdPartyAccount });
            console.log("error: ", res);
            assert.fail("an error should be thrown");
        } catch (error) {
            assert(error.message.includes("error in set Price"), "Unexpected error message");
        }
    });

    it("MainSmartContract should get error when try to remove a HNFT that is not in the list of the market", async () => {
        let issuer = accounts[1];
        let thirdPartyAccount = accounts[2];
        let randomAddress = "0x014fEf6C8a0c8112296E7ABF70A34c2B453b3927";
        let value = 3;
        try {
            const mainSmartContractInstance = await mainSmartContract.deployed();
            const mainSmartContractAddress = mainSmartContractInstance.address;
            let HNFTInstance = await HNFTContract.new("TEST", "TST", { from: issuer });
            // Attempt remove a random address that is not in the market
            let res = await HNFTInstance.approve(mainSmartContractAddress, 0, { from: issuer });
            res = await mainSmartContractInstance.sell(HNFTInstance.address, value, { from: issuer });
            res = await mainSmartContractInstance.removeInSellItem(randomAddress, { from: thirdPartyAccount });
            assert.fail("an error should be thrown");
        } catch (error) {
            assert(error.message.includes("The NFT does not exists in the sell market"), "Unexpected error message");
        }
    });


});
