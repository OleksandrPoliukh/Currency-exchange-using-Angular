import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '../exchange-rate.service';

interface ExchangeRates {
  [key: string]: { [key: string]: number };
}

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  currencies = ['UAH', 'USD', 'EUR'];
  firstCurrency = 'USD';
  secondCurrency = 'UAH';
  firstAmount: number = 1;
  secondAmount: number = 0;
  exchangeRates: ExchangeRates = {};

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.exchangeRateService.exchangeRates$.subscribe(rates => {
      if (rates) {
        this.exchangeRates = rates;
        this.convertFirstToSecond(); // Initial conversion using updated rates
      }
    });

    this.exchangeRateService.fetchExchangeRates();
  }

  private formatAmount(amount: number): number {
    return parseFloat(amount.toFixed(2));
  }

  convertFirstToSecond(): void {
    if (this.firstCurrency === this.secondCurrency) {
      this.secondAmount = this.formatAmount(this.firstAmount);
    } else {
      const rate = this.exchangeRates[this.firstCurrency][this.secondCurrency];
      if (rate) {
        this.secondAmount = this.formatAmount(this.firstAmount * rate);
      } else {
        this.secondAmount = 0;
      }
    }
  }

  convertSecondToFirst(): void {
    if (this.firstCurrency === this.secondCurrency) {
      this.firstAmount = this.formatAmount(this.secondAmount);
    } else {
      const rate = this.exchangeRates[this.secondCurrency][this.firstCurrency];
      if (rate) {
        this.firstAmount = this.formatAmount(this.secondAmount * rate);
      } else {
        this.firstAmount = 0;
      }
    }
  }

  onFirstAmountChange(): void {
    if (this.firstAmount !== null && this.firstAmount !== undefined) {
      this.firstAmount = parseFloat(this.firstAmount.toString());
    }
    this.convertFirstToSecond();
  }

  onSecondAmountChange(): void {
    if (this.secondAmount !== null && this.secondAmount !== undefined) {
      this.secondAmount = parseFloat(this.secondAmount.toString());
    }
    this.convertSecondToFirst();
  }

  onFirstCurrencyChange(): void {
    this.convertFirstToSecond();
  }

  onSecondCurrencyChange(): void {
    this.convertFirstToSecond();
  }
}
