const web3 = require('web3');
const mainSmartContract = artifacts.require("MainSmartContract");
const HNFTContract = artifacts.require("HNFT");

contract("MainSmartContract/HNFT tests", (accounts) => {

        it("HNFT issuer should be the creator of the HNFT it self", async () => {
            let issuer = accounts[1];
            try {
                let HNFTInstance = await HNFTContract.new("TEST", "TST", "TEST_URI", { from: issuer });
                let res = await HNFTInstance.getIssuer();
                assert.equal(issuer, res, "error the creator is not the issuer");
            } catch (error) {
                assert.fail("Unexpected Error");
            }
        });
    
        it("trying to burn a token not on the market", async () => {
            let issuer = accounts[1];
            try {
                let HNFTInstance = await HNFTContract.new("TEST", "TST", "TEST_URI", { from: issuer });
                const mainSmartContractInstance = await mainSmartContract.deployed();
                let res = await HNFTInstance.burn(mainSmartContractInstance.address, { from: issuer });
                assert.fail("an error should be thrown");
            } catch (err) {
                //should return error since HNFT is not in sell 
                assert(err.message.includes("error in main smart contract burn"), "Unexpected error message");
            }
        });
    
        it("MainSmartContract should get a true when checking of the validity of a HNFT", async () => {
            let issuer = accounts[1];
            let value = 3;
            try {
                const mainSmartContractInstance = await mainSmartContract.deployed();
                const mainSmartContractAddress = mainSmartContractInstance.address;
                let HNFTInstance = await HNFTContract.new("TEST", "TST", "TEST_URI", { from: issuer });
                // check validity of an HNFT
                let res = await HNFTInstance.approve(mainSmartContractAddress, 0, { from: issuer });
                res = await mainSmartContractInstance.sell(HNFTInstance.address, value);
                res = await mainSmartContractInstance.checkValidity(HNFTInstance.address);
                await mainSmartContractInstance.removeInSellItem(HNFTInstance.address);
                assert.strictEqual(res, true, 'Value should be true');
            } catch (error) {
                assert.fail("Unexpected Error");
                await mainSmartContractInstance.removeInSellItem(HNFTInstance.address);
            }
        });
    
        it("MainSmartContract owner should not set the price if it is not approved", async () => {
            let issuer = accounts[1];
            let value = 3;
            try {
                let HNFTInstance = await HNFTContract.new("TEST", "TST", "TEST_URI", { from: issuer });
                // Attempt to set Price from MainSmartContract without approval
                let res = await HNFTInstance.setPrice(value); //owner of main smart contract is account[0] that is the default deployer in ganache
                assert.fail("an error should be thrown");
            } catch (error) {
                assert(error.message.includes("The transaction caller is not allowed to perform this action"), "Unexpected error message");
            }
        });
    
    it("MainSmartContract should get error when try to remove a HNFT that is not in the list of the market", async () => {
        let issuer = accounts[1];
        try {
            const mainSmartContractInstance = await mainSmartContract.deployed();
            const mainSmartContractAddress = mainSmartContractInstance.address;
            let HNFTInstance = await HNFTContract.new("TEST", "TST", "TEST_URI", { from: issuer });
            // Attempt remove a random address that is not in the market
            let res = await HNFTInstance.approve(mainSmartContractAddress, 0, { from: issuer });
            res = await mainSmartContractInstance.removeInSellItem(HNFTInstance.address);
            assert.fail("an error should be thrown");
        } catch (error) {
            assert(error.message.includes("The NFT does not exists in the sell market"), "Unexpected error message");
        }
    });

    it("A third party should get error when try to remove a HNFT without being the main smart contract owner", async () => {
        let issuer = accounts[1];
        let thirdPartyAccount = accounts[2];
        let value = 3;
        try {
            const mainSmartContractInstance = await mainSmartContract.deployed();
            const mainSmartContractAddress = mainSmartContractInstance.address;
            let HNFTInstance = await HNFTContract.new("TEST", "TST", "TEST_URI", { from: issuer });
            // Attempt remove an HNFT address not being the owner of MainSmartContract
            let res = await HNFTInstance.approve(mainSmartContractAddress, 0, { from: issuer });
            res = await mainSmartContractInstance.sell(HNFTInstance.address, value);
            res = await mainSmartContractInstance.removeInSellItem(HNFTInstance.address, { from: thirdPartyAccount });
            await mainSmartContractInstance.removeInSellItem(HNFTInstance.address);
            assert.fail("an error should be thrown");
        } catch (error) {
            assert(error.message.includes("Only the owner can run this function."), "Unexpected error message");
        }
    });

    it("MainSmartContract should not be able to transfer HNFT without approve", async () => {
        const issuer = accounts[3];
        const buyer = accounts[5];
        let value = 0;
        try {
            const mainSmartContractInstance = await mainSmartContract.deployed();
            let HNFTInstance = await HNFTContract.new("TEST", "TST", "TEST_URI", { from: issuer });
            // Attempt to transfer HNFT without approval
            let owner = await HNFTInstance.ownerOf(0);
            //Convert int to wei
            const valueInWei = web3.utils.toWei(value.toString(), 'ether');
            // Convert wei to hexadecimal
            const hexValue = web3.utils.toHex(valueInWei);
            res = await mainSmartContractInstance.buy(HNFTInstance.address, owner, { from: buyer, value: hexValue });
            assert.fail("an error should be thrown");
        } catch (error) {
            assert(error.message.includes, "The NFT was not transfered", "Unexpected error message");
        }
    });

    it("MainSmartContract should be able to transfer token on behalf of the owner after approve", async () => {
        const issuer = accounts[7];
        const buyer = accounts[4];
        let value = 3;
        try {
            const mainSmartContractInstance = await mainSmartContract.deployed();
            let mainSmartContractAddress = mainSmartContractInstance.address;
            let HNFTInstance = await HNFTContract.new("TEST", "TST", "TEST_URI", { from: issuer });
            // Attempt to transfer HNFT with approval
            let res = await HNFTInstance.approve(mainSmartContractAddress, 0, { from: issuer });
            let owner = await HNFTInstance.ownerOf(0);
            //Convert int to wei
            const valueInWei = web3.utils.toWei(value.toString(), 'ether');
            // Convert wei to hexadecimal
            const hexValue = web3.utils.toHex(valueInWei);
            res = await mainSmartContractInstance.sell(HNFTInstance.address, hexValue);
            res = await mainSmartContractInstance.buy(HNFTInstance.address, owner, { from: buyer, value: hexValue });
            let newOwner = await HNFTInstance.ownerOf(0);
            assert.equal(newOwner, buyer, "the main smart contract could not do the transfer");
        } catch (error) {
            assert.fail("got an unexpected error: ");
        }
    });

});
