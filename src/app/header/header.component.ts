import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usdUahRate: string = 'Loading...';
  eurUahRate: string = 'Loading...';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchExchangeRates();
  }

  fetchExchangeRates(): void {
    this.http.get<any[]>('https://api.monobank.ua/bank/currency')
      .subscribe(
        data => {
          const usdUah = data.find(item => item.currencyCodeA === 840 && item.currencyCodeB === 980);
          const eurUah = data.find(item => item.currencyCodeA === 978 && item.currencyCodeB === 980);

          if (usdUah) {
            this.usdUahRate = `${usdUah.rateBuy.toFixed(2)} / ${usdUah.rateSell.toFixed(2)}`;
          } else {
            this.usdUahRate = 'Data not available';
          }

          if (eurUah) {
            this.eurUahRate = `${eurUah.rateBuy.toFixed(2)} / ${eurUah.rateSell.toFixed(2)}`;
          } else {
            this.eurUahRate = 'Data not available';
          }
        },
        error => {
          this.usdUahRate = 'Error fetching data';
          this.eurUahRate = 'Error fetching data';
          console.error('Error fetching data from MonoBank API', error);
        }
      );
  }
}
