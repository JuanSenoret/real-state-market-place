import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { WEB3, FlightSuretyAppSmartContract } from '../services/smart-contract.service';
import { FlightSuretyService } from '../services/flight-surety-server.service';
import Web3 from 'web3';
import { TruffleContract } from 'truffle-contract';
import { EthereumService } from '../services/ethereum.service';
import { FlightDetails } from '../models/flight-details.model';
import { SnackbarHomeComponent } from '../snackbar/snackbar-home/snackbar-home.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-oracle-page',
  templateUrl: './oracle-page.component.html',
  styleUrls: ['./oracle-page.component.scss']
})
export class OraclePageComponent implements OnInit, OnDestroy {

  private accounts: any[];
  private balance: number;
  private flightsDetails: FlightDetails[];
  private flightsTableDisplayedColumns = ['airline', 'code', 'departure', 'arrival', 'action'];
  private flightStatus: any[] = [
    {value: '0', viewValue: 'Unknown'},
    {value: '10', viewValue: 'On time'},
    {value: '20', viewValue: 'Delay due to airline'},
    {value: '30', viewValue: 'Delay due to weather'},
    {value: '40', viewValue: 'Delay due to technical issue'},
    {value: '50', viewValue: 'Delay due to other'}
  ];
  private flightSelectedStatusValue = '0';

  private configSnackbarWaitingResponse: MatSnackBarConfig = {
    panelClass: 'snackbar-style-info',
    verticalPosition: 'bottom'
  };
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

  constructor(@Inject(WEB3) private web3: Web3,
              @Inject(FlightSuretyAppSmartContract) private flightSuretyAppSmartContract: TruffleContract,
              private ethService: EthereumService,
              private flightSuretyService: FlightSuretyService,
              private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    await this.flightSuretyService.getFlightDetails().subscribe((response: any) => {
      this.flightsDetails = response.data;
      console.log(this.flightsDetails);
    });
    await this.initWeb3();
  }

  ngOnDestroy(): void {
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
      this.flightSuretyAppSmartContract.setProvider(this.web3.currentProvider);
    }
  }

  public async triggerRequest(flightCode: string, status: string) {
    console.log(`flightCode ${flightCode} status ${status}`);
    // Launch the snack bar with the proper message
    this.snackBar.openFromComponent(SnackbarHomeComponent, {
      data: `Oracles generating responses to smart contract. It will take some seconds`,
      ...this.configSnackbarWaitingResponse
    });
    // Call server to start oracles activities
    await this.flightSuretyService.submitOracleActivity(flightCode, status).subscribe((response: any) => {
      console.log(response);
      if (response.data) {
        if (response.data.informationVerified) {
          // Launch the snack bar with the proper message
          this.snackBar.openFromComponent(SnackbarHomeComponent, {
            data: `Oracle information successfully verified`,
            duration: 5000,
            ...this.configSnackbarSuccess
          });
        } else {
          // Launch the snack bar with the proper message
          this.snackBar.openFromComponent(SnackbarHomeComponent, {
            data: `Oracle information NOT verified`,
            duration: 5000,
            ...this.configSnackbarError
          });
        }
      } else {
        // Launch the snack bar with the proper message
        this.snackBar.openFromComponent(SnackbarHomeComponent, {
          data: `Error calling server`,
          duration: 5000,
          ...this.configSnackbarError
        });
      }
    });
  }
}
