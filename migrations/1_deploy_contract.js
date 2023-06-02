
const MainSmartContract = artifacts.require("MainSmartContract");
const fs = require("fs");

module.exports = function (deployer) {

    deployer.deploy(MainSmartContract).then(() => {
        let constants = {
            "addresses": {
                "mainSmartContractAddress": MainSmartContract.address
            }
        };

        fs.writeFileSync("static/contracts/const.json", JSON.stringify(constants));
        console.log(MainSmartContract.address)
    })


}
