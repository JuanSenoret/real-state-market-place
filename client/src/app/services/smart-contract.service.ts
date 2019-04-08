import { InjectionToken} from '@angular/core';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import { environment } from '../../environments/environment';
import FlightSuretyAppContractAbi from '../../assets/contract/FlightSuretyApp.json';
import FlightSuretyDataContractAbi from '../../assets/contract/FlightSuretyData.json';
import SolnSquareVerifierLocalAbi from '../../assets/contract/SolnSquareVerifier-Local.json';
import SolnSquareVerifierRinkebyAbi from '../../assets/contract/SolnSquareVerifier-Rinkeby.json';

export const WEB3 = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  factory: () => {
    // based on https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    try {
      const provider = ('ethereum' in window) ? window['ethereum'] : Web3.givenProvider;

      return new Web3(provider);
    } catch (err) {
      throw new Error('Unable to retrieve the injected Ethereum provider from  MetaMask');
    }
  }
});

export const FlightSuretyAppSmartContract = new InjectionToken<TruffleContract>('smartContract', {
  providedIn: 'root',
  factory: () =>  TruffleContract(FlightSuretyAppContractAbi),
});

export const FlightSuretyDataSmartContract = new InjectionToken<TruffleContract>('smartContract', {
  providedIn: 'root',
  factory: () =>  TruffleContract(FlightSuretyDataContractAbi),
});

export const SolnSquareVerifierSmartContract = new InjectionToken<TruffleContract>('smartContract', {
  providedIn: 'root',
  factory: () =>  TruffleContract(environment.production ? SolnSquareVerifierRinkebyAbi : SolnSquareVerifierLocalAbi),
});
