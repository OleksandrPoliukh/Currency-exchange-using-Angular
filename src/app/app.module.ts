import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { ExchangeRateService } from './exchange-rate.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ExchangeRateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
