
require('dotenv').config();
const { ADDRESS, PROJECT_ID } = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {
    
    // GANACHE
    development: {
     host: "127.0.0.1",     
     port: 7545,            
     network_id: "*",       
    },
    
    // SEPOLIA. To use this network you need to specify and infura provider and 
    // a private address to be used to deploy the Main smart contract through
    // the ADDRESS and PROJECT_ID variables 
    sepolia: {
      provider: () => new HDWalletProvider(ADDRESS, `https://sepolia.infura.io/v3/${PROJECT_ID}`),
      network_id: 11155111, // Sepolia's id
      confirmations: 0,     
      timeoutBlocks: 200,   
      skipDryRun: true     
    }
    
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19"      // Fetch exact version from solc-bin (default: truffle's version)
    }
  }

};
