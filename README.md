# BlockchainProject - HNFT <img src="https://github.com/FabrizioSandri/BlockchainProject/blob/09cecba4b604a1103051fd1a704e54d386cc37b1/static/images/hnft.png" align="right" height="140" />

This repository contains the implementation of an architecture specifically designed to handle Honey NFTs, which serve as digital assets representing a batch of honey throughout its journey from the association to its final destination.

## Requirements
Before launching the web application, ensure that Node JS is installed on your system. Additionally, if you intend to run the dapp from the association's perspective, it is essential to supply a valid Infura IPFS API key. You can specify this key within the [static/contracts/const.json](https://github.com/FabrizioSandri/BlockchainProject/tree/main/static/contracts/const.json) file.

## Usage
> **Warning**
> It is essential to understand that in the current implementation, both the buyers and the association must be aware of the same address of the Main smart contract in order to interact correctly. To ensure smooth communication, the Association, upon deploying the Main smart contract, is responsible for distributing the web application package that includes the accurate address of the Main smart contract stored inside the [static/contracts/const.json](https://github.com/FabrizioSandri/BlockchainProject/tree/main/static/contracts/const.json) file.
>
>To follow the workflow for running this application, please follow the steps outlined below:
>
>1. The association deploys the Main smart contract according to the instructions provided below.
>2. The association then distributes the web application package to the buyers, ensuring that it contains the correct address of the Main smart contract.
>
>By following these steps, all buyers will have access to and interact with the same instance of the Main smart contract, facilitating a seamless and consistent user experience.


### Association Usage
If you are the association and want to get started with this web application, follow the steps below:

1.  Clone this repository to your local machine and navigate to the project directory and install the necessary dependencies by running:
   ```shell
   cd BlockchainProject
   npm install
   ```
2. Configure the `ENV.json` file based on the provided template in [ENV.json.sample](https://github.com/FabrizioSandri/BlockchainProject/blob/main/ENV.json.sample). Ensure that you provide valid API keys for the Infura IPFS provider.
3. Deploy the Main smart contract by running `truffle migrate --reset` or by simply running. 
   ```shell
   npm run build
   ```
   > NOTE: If you want to specify a custom network for the deployment you can edit [truffle-config.js](https://github.com/FabrizioSandri/BlockchainProject/blob/main/truffle-config.js)
5. Once the project is properly set up, start the web app by running:
   ```shell
   npm run start
   ```
6. You can now access the web app locally by opening your browser and visiting [localhost:3000](http://127.0.0.1:3000).


### Buyer Usage
If you are a buyer and want to get started with this web application, follow the steps below:

1.  Clone this repository to your local machine and navigate to the project directory and install the necessary dependencies by running:
   ```shell
   cd BlockchainProject
   npm install
   ```
2. Start the web app by running:
   ```shell
   npm start
   ```
3. You can now access the web app locally by opening your browser and visiting [localhost:3000](http://127.0.0.1:3000).


## Running the Tests
To execute the unit tests for the smart contracts, you can utilize the following command:

```shell
npm run test
```

By running this command, the test suite will be initiated, allowing you to verify the functionality and integrity of the smart contracts. Please ensure that all dependencies are properly installed before running the tests.
