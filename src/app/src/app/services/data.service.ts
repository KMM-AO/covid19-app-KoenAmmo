import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private API_URL = 'https://api.covid19api.com/';
  // https://api.covid19api.com/total/dayone/country/COUNTRYNAME list for all data from day one for one country

  constructor(private httpClient: HttpClient) { }

  public getRequest() {

    return this.httpClient.get(this.API_URL).pipe(catchError(this.handleError));
  }
  public getCountriesListRequest() {

    return this.httpClient.get(this.API_URL+'countries').pipe(catchError(this.handleError));
  }
  public getCountryRequest(country) {

    return this.httpClient.get(this.API_URL+"total/dayone/country/"+country).pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    let errorText = 'Error';
    if (error.error instanceof ErrorEvent) {
      // Client side errors
      errorText = `Error: ${error.error.message}`;
    } else {
      // Server side errors
      errorText = `Error Status: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorText);
    return throwError(errorText);
  }

}
