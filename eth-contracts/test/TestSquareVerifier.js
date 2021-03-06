// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
const Verifier = artifacts.require('Verifier');
const proofSuccess = require('../config/proof.json');
const proofInvalid = require('../config/proof-invalid.json');

contract('Verifier', accounts => {

    const owner = accounts[0];
    let result;

    describe('Test ZoKrates Verifier Contract', () => {

        before(async () => { 
            this.contract = await Verifier.new({from: owner});
        });

        // Test verification with correct proof
        // - use the contents from proof.json generated from zokrates steps
        it('Test verification with correct proof', async () => {
            result = await this.contract.verifyTx.call(
                proofSuccess.proof.A,
                proofSuccess.proof.A_p,
                proofSuccess.proof.B,
                proofSuccess.proof.B_p,
                proofSuccess.proof.C,
                proofSuccess.proof.C_p,
                proofSuccess.proof.H,
                proofSuccess.proof.K,
                proofSuccess.input
            );
            assert.equal(result, true, 'Error: Verification invalid');
        });

        // Test verification with incorrect proof
        it('Test verification with invalid proof', async () => {
            await expectThrow(this.contract.verifyTx.call(
                proofInvalid.proof.A,
                proofInvalid.proof.A_p,
                proofInvalid.proof.B,
                proofInvalid.proof.B_p,
                proofInvalid.proof.C,
                proofInvalid.proof.C_p,
                proofInvalid.proof.H,
                proofInvalid.proof.K,
                proofInvalid.input
            ));
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
