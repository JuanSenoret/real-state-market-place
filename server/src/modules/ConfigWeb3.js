import Config from '../config/config.json';
import SolnSquareVerifier from '../config/SolnSquareVerifier.json';
import Web3 from 'web3';

class ConfigWeb3 {
    constructor () {
        this.web3 = null;
        this.accounts = null;
        this.solnSquareVerifierContract = null;
        this.config = null;
    }

    async getWeb3 () {
        try {
            this.config = Config['localhost'];
            // Get web3 instance
            this.web3 = new Web3(new Web3.providers.WebsocketProvider(this.config.url.replace('http', 'ws')));
            this.accounts = await this.web3.eth.getAccounts();
            this.web3.eth.defaultAccount = this.accounts[0];
            // Get flightSuretyApp contract instance
            this.solnSquareVerifierContract = new this.web3.eth.Contract(SolnSquareVerifier.abi, this.config.solnSquareVerifierAddress);
        } catch (error) {
            console.log(error);
            return null;
        }

        return{
            web3: this.web3,
            accounts: this.accounts,
            solnSquareVerifierContract: this.solnSquareVerifierContract,
            solnSquareVerifierAddress: this.config.solnSquareVerifierAddress,
            owner: this.accounts[0],
            gas: "6721975"
        };
    }
}

export default ConfigWeb3;
