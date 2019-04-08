// migrating the appropriate contracts
const Verifier = artifacts.require("Verifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const MyCustomERC721Token = artifacts.require("MyCustomERC721Token");
const fs = require('fs');

module.exports = function(deployer, network, accounts) {

  console.log('Network selected to deploy: ' + network);

  if (network == "rinkeby") {
    // Deploy Verifier and SolnSquareVerifier contracts
    deployer.deploy(Verifier, {from: accounts[0]})
    .then(() => {
        return deployer.deploy(SolnSquareVerifier, Verifier.address, "MyERC721", "MyERC721", {from: accounts[0]})
        .then(async () => {
          // Store in client the contracts ABIs and addresses
          await fs.writeFileSync(__dirname + '/../../client/src/assets/contract/SolnSquareVerifier-Rinkeby.json',JSON.stringify(SolnSquareVerifier, null, '\t'), 'utf-8');
          return true;
        });
    });

  } else if (network == "development") {
    // Deploy MyCustomERC721Token
    deployer.deploy(MyCustomERC721Token, "MyERC721", "MyERC721", {from: accounts[0]});

    // Deploy Verifier and SolnSquareVerifier contracts
    deployer.deploy(Verifier, {from: accounts[0]})
    .then(() => {
        return deployer.deploy(SolnSquareVerifier, Verifier.address, "MyERC721", "MyERC721", {from: accounts[0]})
        .then(async () => {
          let config = {
            localhost: {
                url: 'http://localhost:7545',
                solnSquareVerifierAddress: SolnSquareVerifier.address,
            }
          }
          // Store in server the contract addresses and url to connect to the network
          await fs.writeFileSync(__dirname + '/../../server/src/config/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
          // Store in server the contracts ABIs and addresses
          await fs.writeFileSync(__dirname + '/../../server/src/config/SolnSquareVerifier-Local.json',JSON.stringify(SolnSquareVerifier, null, '\t'), 'utf-8');
          // Store in client the contracts ABIs and addresses
          await fs.writeFileSync(__dirname + '/../../client/src/assets/contract/SolnSquareVerifier-Local.json',JSON.stringify(SolnSquareVerifier, null, '\t'), 'utf-8');
          return true;
        });
    });
  }
};
