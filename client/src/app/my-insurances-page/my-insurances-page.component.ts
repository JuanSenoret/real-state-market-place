import { Component, Inject, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { exhaustMap, switchMap, map, tap, catchError } from 'rxjs/operators';
import { WEB3, FlightSuretyAppSmartContract } from '../services/smart-contract.service';
import Web3 from 'web3';
import { TruffleContract } from 'truffle-contract';
import { EthereumService } from '../services/ethereum.service';
import { SnackbarHomeComponent } from '../snackbar/snackbar-home/snackbar-home.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { InsuranceDetails } from '../models/insurance-details.model';

@Component({
  selector: 'app-my-insurances-page',
  templateUrl: './my-insurances-page.component.html',
  styleUrls: ['./my-insurances-page.component.scss']
})
export class MyInsurancesPageComponent implements OnInit {

  private accounts: any[];
  private passengerAccount: string;
  private balance: number;
  private insurancesDetails: InsuranceDetails[];
  private insurancesTableDisplayedColumns = ['code', 'amount', 'status', 'action'];
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
    @Inject(FlightSuretyAppSmartContract) private flightSuretyAppSmartContract: TruffleContract,
    private ethService: EthereumService,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    // Initialize web3
    await this.initWeb3();
    // Fetch passenger insurances details
    await this.fetchPassengerInsurancesDetails(this.accounts[0]).subscribe((response: InsuranceDetails[]) => {
      this.insurancesDetails = response;
      //console.log(this.insurancesDetails);
    });
    this.passengerAccount = this.accounts[0];
  }

  private async initWeb3() {
    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
      this.accounts = await this.ethService.getAccounts();
      // Set manually the default account
      this.ethService.defaultAccount = this.accounts[0];
      // set the provider for the FlightSuretyApp smart contract
      this.flightSuretyAppSmartContract.setProvider(this.web3.currentProvider);
      // Get account balance
      await this.ethService.getAccountBalance().subscribe((response: any) => {
        this.balance = response;
      });
    }
  }

  private fetchPassengerInsurancesDetails(passengerAddress: string): Observable<InsuranceDetails[]> {
    return from(this.fetchInsurancesFlightCodesByPassenger(passengerAddress)).pipe(
      switchMap(async (response: any) => {
        const items: any[] = [];
        if (!(response === 'Error')) {
          if (response.length > 0) {
            for (const code of response) {
              const insuranceDetails = await this.fetchInsurancesDetailsByPassengerAndCode(passengerAddress, code);
              items.push(insuranceDetails);
            }
          }
        }
        return items;
      })
    );
  }

  private fetchInsurancesFlightCodesByPassenger(passengerAddress: string): Observable<InsuranceDetails[]> {
    return from(this.flightSuretyAppSmartContract.deployed()).pipe(
      switchMap((instance: any) => from <any> (
        instance.fetchActiveInsurancesKeysForPassenger(
          {from: passengerAddress}
        )
      )
    ),
    catchError((err: any) => from <any> (['Error']))
    );
  }

  private async fetchInsurancesDetailsByPassengerAndCode(passengerAddress: string, code: string) {
    const insuranceDetails = {} as InsuranceDetails;
    await this.flightSuretyAppSmartContract.deployed()
    .then((instance) => {
      return instance.fetchInsurancesInfoForPassengerAndCode.call(
        code,
        {from: passengerAddress}
      );
    })
    .then((result) => {
      console.log(result);
      insuranceDetails.flightCode = this.web3.utils.toUtf8(result[0]);
      insuranceDetails.amount = this.web3.utils.fromWei(result[1], 'ether');
      insuranceDetails.status = this.web3.utils.BN(result[2]).toString();
      insuranceDetails.statusText = this.getStatusText(this.web3.utils.BN(result[2]).toString());
    })
    .catch((error) => {
      console.log(`Error in function flightSuretyAppSmartContract ${error}`);
    });
    return insuranceDetails;
  }

  private async withdraw(code: string) {
    console.log(`Passenger withdraw insurance for flight ${code}`);
    await this.withdrawEth(code).subscribe(async (response: any) => {
      if (!(response === 'Error')) {
        if (response.logs[0]) {
          if (response.logs[0].event === 'PassengerWithdrawStatus') {
            console.log();
            // Launch the snack bar with the proper message
            this.snackBar.openFromComponent(SnackbarHomeComponent, {
              data: `Insurance successfully withdraw for flight ${this.web3.utils.toUtf8(response.logs[0].args.code)}`,
              ...this.configSnackbarSuccess
            });
            // Reload insurances list
            await this.fetchPassengerInsurancesDetails(this.accounts[0]).subscribe((response: InsuranceDetails[]) => {
              this.insurancesDetails = response;
              //console.log(this.insurancesDetails);
            });
          } else {
            console.log(`Error buying insurance for flight ${code}`);
            this.snackBar.openFromComponent(SnackbarHomeComponent, {
              data: `Error buying insurance for flight ${code}`,
              ...this.configSnackbarError
            });
          }

        } else {
          console.log(`Error withdraw insurance for flight ${code}`);
          this.snackBar.openFromComponent(SnackbarHomeComponent, {
            data: `Error during withdraw insurance for flight ${code}`,
            ...this.configSnackbarError
          });
        }
      } else {
        console.log(`Error withdraw insurance for flight ${code}`);
        this.snackBar.openFromComponent(SnackbarHomeComponent, {
          data: `Error during withdraw insurance for flight ${code}`,
          ...this.configSnackbarError
        });
      }
    });
  }

  private withdrawEth(code: string): Observable<any> {
    return from(this.flightSuretyAppSmartContract.deployed()).pipe(
      switchMap((instance: any) => from <any> (
        instance.passengerWithdraw(
          this.web3.utils.asciiToHex(code),
          {from: this.accounts[0]}
        )
      )
    ),
    catchError((err: any) => from <any> (['Error']))
    );
  }

  private getStatusText(status: string) {
    let text = '';
    if (status === '0') {
      text = 'Flight in progress';
    } else if (status === '1') {
      text = 'Insurance ready for withdraw';
    } else {
      text = 'Insurance expired';
    }
    return text;
  }

  private isButtonDisabled(status: string) {
    let isEnabled = false;
    if (status === '1') {
      isEnabled = false;
    } else {
      isEnabled = true;
    }
    return isEnabled;
  }
}
