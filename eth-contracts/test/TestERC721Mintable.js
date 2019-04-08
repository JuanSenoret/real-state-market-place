const MyCustomERC721Token = artifacts.require('MyCustomERC721Token');

contract('MyCustomERC721Token', accounts => {

    const name = 'RealState';
    const symbol = 'RST';
    const owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];
    const tokenId1 = 1111;
    const tokenId2 = 2222;
    const tokenUri1 = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/' + tokenId1;
    const tokenUri2 = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/' + tokenId2;
    let result;
    let tx;

    describe('match erc721 spec', () => {
        beforeEach(async () => { 
            this.contract = await MyCustomERC721Token.new(name, symbol, {from: owner});

            // DONE: mint multiple tokens
            await this.contract.mint(account_one, tokenId1, {from: owner});
            await this.contract.mint(account_one, tokenId2, {from: owner});
        });

        it('should return total supply', async () => {
            result = await this.contract.totalSupply.call({from: owner});
            // Check the result total supply
            assert.equal(result, 2, 'Error: Invalid total supply');
        });

        it('should get token balance', async () => {
            result = await this.contract.balanceOf(account_one, {from: owner});
            // Check the result balance of
            assert.equal(result, 2, 'Error: Invalid balance');
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async () => {
            // Get token uri for token Id 1
            result = await this.contract.tokenURI(tokenId1, {from: owner});
            // Check the result balance of
            assert.equal(result, tokenUri1, 'Error: Invalid token uri 1');

            // Get token uri for token Id 2
            result = await this.contract.tokenURI(tokenId2, {from: owner});
            // Check the result balance of
            assert.equal(result, tokenUri2, 'Error: Invalid token uri 2');
        });

        it('should transfer token from one owner to another', async () => { 
            tx = await this.contract.transferFrom(account_one, account_two, tokenId2, {from: account_one});
            assert.equal(tx.logs[0].event, 'Transfer');
            assert.equal(tx.logs[0].args.from, account_one);
            assert.equal(tx.logs[0].args.to, account_two);
            assert.equal(tx.logs[0].args.tokenId, tokenId2);
        });
    });

    describe('have ownership properties', () => {
        beforeEach(async () => { 
            this.contract = await MyCustomERC721Token.new(name, symbol, {from: owner});
        });

        it('should fail when minting when address is not contract owner', async () => { 
            await expectThrow(this.contract.mint(account_one, tokenId2, {from: account_two}));
        });

        it('should return contract owner', async () => { 
            result = await this.contract.getOwner.call({from: owner});
            // Check the contract owner
            assert.equal(result, owner, 'Error: Invalid contract Owner');
        });

    });
});

const expectThrow = async (promise) => {
    try {
        await promise;
    } catch (error) {
        assert.exists(error);
        return;
    }

    assert.fail('Expected an error but didnt see one!');
};
