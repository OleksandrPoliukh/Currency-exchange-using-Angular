import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface ExchangeRates {
  [key: string]: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private exchangeRatesSubject = new BehaviorSubject<ExchangeRates | null>(null);
  exchangeRates$ = this.exchangeRatesSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchExchangeRates(): void {
    this.http.get<any[]>('https://api.monobank.ua/bank/currency')
      .pipe(
        tap(data => this.updateExchangeRates(data)),
        catchError(this.handleError)
      ).subscribe();
  }

  private updateExchangeRates(data: any[]): void {
    const rates: ExchangeRates = {
      'UAH': { 'USD': 0, 'EUR': 0, 'UAH': 1 },
      'USD': { 'UAH': 0, 'EUR': 0, 'USD': 1 },
      'EUR': { 'UAH': 0, 'USD': 0, 'EUR': 1 }
    };

    data.forEach(item => {
      if (item.currencyCodeA === 840 && item.currencyCodeB === 980) {
        rates['USD']['UAH'] = item.rateBuy || item.rateCross;
        rates['UAH']['USD'] = 1 / (item.rateBuy || item.rateCross);
      } else if (item.currencyCodeA === 978 && item.currencyCodeB === 980) {
        rates['EUR']['UAH'] = item.rateBuy || item.rateCross;
        rates['UAH']['EUR'] = 1 / (item.rateBuy || item.rateCross);
      } else if (item.currencyCodeA === 840 && item.currencyCodeB === 978) {
        rates['USD']['EUR'] = item.rateBuy || item.rateCross;
        rates['EUR']['USD'] = 1 / (item.rateBuy || item.rateCross);
      } else if (item.currencyCodeA === 978 && item.currencyCodeB === 840) {
        rates['EUR']['USD'] = item.rateBuy || item.rateCross;
        rates['USD']['EUR'] = 1 / (item.rateBuy || item.rateCross);
      }
    });

    // Calculate indirect rates if direct rates are not available
    if (rates['USD']['EUR'] === 0 && rates['USD']['UAH'] !== 0 && rates['UAH']['EUR'] !== 0) {
      rates['USD']['EUR'] = rates['USD']['UAH'] * rates['UAH']['EUR'];
      rates['EUR']['USD'] = 1 / rates['USD']['EUR'];
    }

    this.exchangeRatesSubject.next(rates);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error fetching exchange rates from MonoBank API', error);
    throw error;
  }
}
