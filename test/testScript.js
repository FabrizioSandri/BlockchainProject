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

    

});
