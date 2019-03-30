// migrating the appropriate contracts
//const SquareVerifier = artifacts.require("./SquareVerifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
const MyCustomERC721Token = artifacts.require("MyCustomERC721Token");

module.exports = function(deployer) {
  //deployer.deploy(SquareVerifier);
  deployer.deploy(SolnSquareVerifier, "MyERC721", "MyERC721");
  //deployer.deploy(MyCustomERC721Token, "MyERC721", "MyERC721");
  deployer.deploy(MyCustomERC721Token, "MyERC721", "MyERC721")
  .then(() => {
    console.log('Successfully deployed');
  })
  .catch((error) => {
    console.log(error);
  });
};
