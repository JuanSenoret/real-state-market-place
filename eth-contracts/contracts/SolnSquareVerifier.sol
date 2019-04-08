pragma solidity ^0.5.0;

import './ERC721Mintable.sol';

// DONE define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is MyCustomERC721Token {

    // FlightSuretyData contract
    VerifierInterface verifierInterface;

    // DONE define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address solutionAddress;
    }

    // DONE define an array of the above struct
    Solution[] solutions;

    // DONE define a mapping to store unique solutions submitted
    mapping(uint256 => Solution) private uniqueSubmittedSolutions;

    // DONE Create an event to emit when a solution is added
    event SolutionAdded(uint256 solutionIndex, address solutionAddress);

    // Event to inform about a token was mint
    event TokenMint(uint256 tokenId, address to);

    constructor(address verifierAddress, string memory name, string memory symbol) MyCustomERC721Token(name, symbol) public {
        verifierInterface = VerifierInterface(verifierAddress);
    }

    // DONE Create a function to add the solutions to the array and emit the event
    function addSolution
    ( 
        address to,
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    ) 
        public 
    {
        // Check if solution already exist
        require(isUniqueSolution(a, a_p, b, b_p, c, c_p, h, k, input), 'Solution already exist');

        // Check if solution is valid
        require(verifierInterface.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), "Solution not valid");

        // Calculate the hash of the solution which will be the index in the mapping
        uint256 indexHash = calculateHashIndexOfSolution(a, a_p, b, b_p, c, c_p, h, k, input);

        // Add solution to the array
        solutions.push(Solution({index: indexHash, solutionAddress: to}));

        // add solution to mapping
        uniqueSubmittedSolutions[indexHash] = Solution({index: indexHash, solutionAddress: to});

        // Emit proper event
        emit SolutionAdded(indexHash, to);
    }

    // DONE Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNFT
    (
        address to,
        uint256 tokenId,
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    )
        public
    {
        // Add solution to the array and mapping. In addSolution there are verify solution check and unique solution check
        addSolution(to, a, a_p, b, b_p, c, c_p, h, k, input);

        // Mint the token. Metadata are managed inside mint function
        super.mint(to, tokenId);

        // Emit proper event
        emit TokenMint(tokenId, to);
    }

    function isUniqueSolution
    (
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    )
        private
        view
        returns(bool)
    {
        bool isUnique = false;
        uint256 indexHash = calculateHashIndexOfSolution(a, a_p, b, b_p, c, c_p, h, k, input);
        if (uniqueSubmittedSolutions[indexHash].solutionAddress == address(0)) {
            isUnique = true;
        }
        return isUnique;
    }

    function calculateHashIndexOfSolution
    (
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    )
        private
        pure
        returns (uint256)
    {
        return uint256(keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input)));
    }
}

// DONE define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// ABI
contract VerifierInterface {
    function verifyTx(
        uint[2] memory,
        uint[2] memory,
        uint[2][2] memory,
        uint[2] memory,
        uint[2] memory,
        uint[2] memory,
        uint[2] memory,
        uint[2] memory,
        uint[2] memory
    ) public returns (bool);
}