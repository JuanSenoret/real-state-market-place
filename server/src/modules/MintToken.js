import ConfigWeb3 from './ConfigWeb3';

class MintToken {
    constructor (payload) {
        this.web3Object = null;
        this.response = {
            data: null,
            error: '',
            message: '',
            code: 200
        };
        this.payload = payload;
    }

    async run() {
        try {
            // Init the web3 instance
            const configWeb3Object = new ConfigWeb3();
            this.web3Object = await configWeb3Object.getWeb3();
            //console.log(this.payload);
            await this._mintToken();
        } catch (error) {
            this.response.error = error;
            this.response.message = 'Error while minting real state token';
            this.response.code = 400;
        }
        return this.response;
    }

    async _mintToken() {
        await this.web3Object.solnSquareVerifierContract.methods
        .mintNFT(
            this.payload.address,
            this.payload.tokenId,
            this.payload.proof.A,
            this.payload.proof.A_p,
            this.payload.proof.B,
            this.payload.proof.B_p,
            this.payload.proof.C,
            this.payload.proof.C_p,
            this.payload.proof.H,
            this.payload.proof.K,
            this.payload.input
        )
        .send({
            from: this.web3Object.owner,
            gas: this.web3Object.gas
        })
        .then(result =>{
            console.log(result);
            //console.log(`App contract function ${result.events.AirlineRegistration.event} successfully register new airline ${airlineName}`);
        })
        .catch((error) =>{
            // Uncomment for debugging
            console.log(`Error by _mintToken ${error}`);
            //console.log(`Airline ${airlineName} already registered`);
        });
    }
}

export default MintToken;
