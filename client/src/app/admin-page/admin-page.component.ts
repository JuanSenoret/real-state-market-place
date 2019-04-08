import { Component, Inject, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import {exhaustMap, switchMap, map, tap, catchError } from 'rxjs/operators';
import { WEB3, SolnSquareVerifierSmartContract } from '../services/smart-contract.service';
import Web3 from 'web3';
import {TruffleContract} from 'truffle-contract';
import { EthereumService } from '../services/ethereum.service';
import { SnackbarHomeComponent } from '../snackbar/snackbar-home/snackbar-home.component';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  private srcResult: any;
  private tokenId: string = '';
  private address: string = '';
  private accounts: any[];
  private balance: number;
  private configSnackbarSuccess: MatSnackBarConfig = {
    panelClass: 'snackbar-style-success',
    duration: 10000,
    verticalPosition: 'bottom'
  };
  private configSnackbarError: MatSnackBarConfig = {
    panelClass: 'snackbar-style-error',
    duration: 10000,
    verticalPosition: 'bottom'
  };

  constructor(
      @Inject(WEB3) private web3: Web3,
      @Inject(SolnSquareVerifierSmartContract) private solnSquareVerifierSmartContract: TruffleContract,
      private ethService: EthereumService,
      private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    await this.initWeb3();
  }

  private async initWeb3() {
    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
      this.accounts = await this.ethService.getAccounts();
      // Set manually the default account
      this.ethService.defaultAccount = this.accounts[0];
      // Get account balance
      await this.ethService.getAccountBalance().subscribe((response: any) => {
        this.balance = response;
        console.log(this.balance);
      });
      // set the provider for the FlightSuretyApp smart contract
      this.solnSquareVerifierSmartContract.setProvider(this.web3.currentProvider);
    }
  }

  public async submit() {
    //console.log(JSON.parse(this.srcResult));
    //console.log(`TokenId: ${this.tokenId}`);
    //console.log(`Address: ${this.address}`);
    await this.mintToken(JSON.parse(this.srcResult)).subscribe((response: any) => {
      console.log(response);
      if (!(response === 'Error')) {
        if (response.logs[0] && response.logs[1] && response.logs[2]) {
          if (response.logs[0].event === 'SolutionAdded' && response.logs[1].event === 'Transfer' && response.logs[2].event === 'TokenMint') {
            this.snackBar.openFromComponent(SnackbarHomeComponent, {
              data: `Token ${this.tokenId} successfully mint`,
              ...this.configSnackbarSuccess
            });
          } else {
            console.log(`Error mint token ${this.tokenId}`);
            this.snackBar.openFromComponent(SnackbarHomeComponent, {
              data: `Error mint token ${this.tokenId}`,
              ...this.configSnackbarError
            });
          }
        } else {
          console.log(`Error mint token ${this.tokenId}`);
          this.snackBar.openFromComponent(SnackbarHomeComponent, {
            data: `Error mint token ${this.tokenId}`,
            ...this.configSnackbarError
          });
        }
      } else {
        console.log(`Error mint token ${this.tokenId}`);
        this.snackBar.openFromComponent(SnackbarHomeComponent, {
          data: `Error mint token ${this.tokenId}`,
          ...this.configSnackbarError
        });
      }
    });
  }

  private mintToken(proofObject: any): Observable<any> {
    return from(this.solnSquareVerifierSmartContract.deployed()).pipe(
      switchMap((instance: any) => from <any> (
        instance.mintNFT(
          this.address,
          Number(this.tokenId),
          proofObject.proof.A,
          proofObject.proof.A_p,
          proofObject.proof.B,
          proofObject.proof.B_p,
          proofObject.proof.C,
          proofObject.proof.C_p,
          proofObject.proof.H,
          proofObject.proof.K,
          proofObject.input,
          {from: this.accounts[0]}
        )
      )
    ),
    catchError((err: any) => from <any> (['Error']))
    );
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };
      reader.readAsText(inputNode.files[0]);
    }
  }
}
