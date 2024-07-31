import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private exchangeRatesSubject = new BehaviorSubject<any>(null);
  exchangeRates$ = this.exchangeRatesSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchExchangeRates(): void {
    this.http.get<any[]>('https://api.monobank.ua/bank/currency')
      .pipe(
        map(data => {
          const rates: any = {
            'UAH': { 'USD': 0, 'EUR': 0 },
            'USD': { 'UAH': 0, 'EUR': 0 },
            'EUR': { 'UAH': 0, 'USD': 0 }
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
            }
          });

          return rates;
        })
      )
      .subscribe(rates => {
        this.exchangeRatesSubject.next(rates);
      });
  }

  getExchangeRate(currencyA: string, currencyB: string): Observable<number> {
    return this.exchangeRates$.pipe(
      map(rates => {
        if (rates && rates[currencyA] && rates[currencyA][currencyB]) {
          return rates[currencyA][currencyB];
        }
        return 0;
      })
    );
  }
}
