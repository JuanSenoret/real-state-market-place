const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonicLocal = "candy maple coke sugar pudding cream honey rich smooth crumble salt treat";
const MNEMONIC = "your mnemonic";
const API_KEY = "YOUR INFURA API KEY";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: '*',
      gas: 6721974
    },
    rinkeby: {
        provider: function() {
            return new HDWalletProvider(MNEMONIC, 'https://rinkeby.infura.io/v3/' + API_KEY)
        },
        network_id: 4,
        gas: 4500000,
        gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: "^0.5.0", // A version or constraint - Ex. "^0.5.0"
      settings: {
        optimizer: {
          enabled: true,
          runs: 200   // Optimize for how many times you intend to run the code
        }
      }
    }
  }
};