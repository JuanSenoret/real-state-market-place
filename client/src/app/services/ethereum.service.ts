import { Injectable, Inject } from '@angular/core';
// Web3
import { WEB3 } from '../services/smart-contract.service';
import Web3 from 'web3';

import { Observable, of, from } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable()
export class EthereumService {

    constructor(@Inject(WEB3) private web3: Web3) {
    }

    get defaultAccount(): string { return this.web3.eth.defaultAccount; }
    set defaultAccount(account: string) { this.web3.eth.defaultAccount = account; }
    /*
    public getAccounts(): Observable<string[]> {
      // !!! here we are using the from operator to convert Promise to Observable
       // see https://www.learnrxjs.io/operators/creation/from.html
       return from(this.web3.eth.getAccounts()).pipe(
         map(result => <string[]>result)
       );
    }*/
    public getAccounts(): any[] {
      return this.web3.eth.getAccounts();
    }


    public getAccountBalance(): Observable<string> {
        return from(this.web3.eth.getBalance(this.defaultAccount)).pipe(
          tap(wei_balance => console.log('wei balance', wei_balance)),
          // based on https://web3js.readthedocs.io/en/1.0/web3-utils.html
          // web3.utils.fromWei always returns a string number.
          map(wei_balance => this.web3.utils.fromWei(wei_balance, 'ether')),
          tap(eth_balance => console.log('eth balance', eth_balance)),

        );
    }
}
