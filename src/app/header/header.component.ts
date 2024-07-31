import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '../exchange-rate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usdUahRate: string = 'Loading...';
  eurUahRate: string = 'Loading...';

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.exchangeRateService.exchangeRates$.subscribe(rates => {
      if (rates) {
        const usdUah = rates['USD']['UAH'];
        const eurUah = rates['EUR']['UAH'];

        if (usdUah) {
          this.usdUahRate = `${usdUah.toFixed(2)}`;
        } else {
          this.usdUahRate = 'Data not available';
        }

        if (eurUah) {
          this.eurUahRate = `${eurUah.toFixed(2)}`;
        } else {
          this.eurUahRate = 'Data not available';
        }
      }
    });

    this.exchangeRateService.fetchExchangeRates();
  }
}
