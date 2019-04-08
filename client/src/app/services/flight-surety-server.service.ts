import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class FlightSuretyService {
  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient){}

  // Call server REST API to get the flight details. That can be done calling directly the smart contract but I wanted to test this
  // way to rerieve data from the server side, which does the call to the smart contrat
  getFlightDetails() {
    return this.httpClient.get(this.baseUrl + 'flightsDetails');
  }

  submitOracleActivity(flightCode: string, status: string) {
    return this.httpClient.get(this.baseUrl + `oracles-trigger:${flightCode},${status}`);
  }
}
