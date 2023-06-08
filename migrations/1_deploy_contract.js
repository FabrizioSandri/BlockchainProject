
const MainSmartContract = artifacts.require("MainSmartContract");
const fs = require("fs");

module.exports = function (deployer) {

    deployer.deploy(MainSmartContract).then(() => {
        let constants = {
            "addresses": {
                "mainSmartContractAddress": MainSmartContract.address
            }
        };
        
        if (!fs.existsSync("static/contracts/")){
            fs.mkdirSync("static/contracts/");
        }

        fs.writeFileSync("static/contracts/const.json", JSON.stringify(constants));
        fs.copyFileSync("build/contracts/MainSmartContract.json", "static/contracts/MainSmartContract.json")
        fs.copyFileSync("build/contracts/HNFT.json", "static/contracts/HNFT.json")

        console.log(MainSmartContract.address)
    })


}
