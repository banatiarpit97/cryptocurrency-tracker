import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HoldingsProvider } from '../../providers/holdings/holdings';


@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-add-holding',
  templateUrl: 'add-holding.html',
})
export class AddHoldingPage {

  private cryptoUnavailable: boolean = false;
  private checkingValidity: boolean = false;
  private cryptoCode: string;
  private displayCurrency: string;
  private amountHolding;
  private noConnection: boolean = false;
  editHolding;
  edit=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public holdingsProvider:HoldingsProvider) {
    this.editHolding = this.navParams.get('holding');
    if(this.editHolding){
      this.edit=true;
      this.cryptoCode = this.editHolding.crypto;
      this.displayCurrency = this.editHolding.currency;
      this.amountHolding = this.editHolding.amount;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddHoldingPage');
  }

  addHolding(): void {

    this.cryptoUnavailable = false;
    this.noConnection = false;
    this.checkingValidity = true;

    let holding = {
      crypto: this.cryptoCode,
      currency: this.displayCurrency,
      amount: this.amountHolding || 0
    };

    this.holdingsProvider.verifyHoldings(holding).subscribe((result) => {

      this.checkingValidity = false;

      if (result.success) {
        this.holdingsProvider.addHolding(holding);
        this.navCtrl.pop();
      } else {
        this.cryptoUnavailable = true;
      }

    }, (err) => {
      this.noConnection = true;
      this.checkingValidity = false;

    });
  }

  editHoldingValues(){

    this.cryptoUnavailable = false;
    this.checkingValidity = true;
    var index = this.holdingsProvider.holdings.indexOf(this.editHolding);
    let holding = {
      crypto: this.cryptoCode,
      currency: this.displayCurrency,
      amount: this.amountHolding || 0
    };
    console.log(holding)
    

    this.holdingsProvider.verifyHoldings(holding).subscribe((result) => {

      this.checkingValidity = false;

      if (result.success) {
        console.log('yes')
        this.holdingsProvider.editHolding(holding, index);
        this.navCtrl.pop();
      } else {
        console.log('no')
        
        this.cryptoUnavailable = true;
      }

    }, (err) => {

      this.checkingValidity = false;

    });
  }

  seeSupport() {
    window.open('https://www.cryptonator.com/api/currencies', '_system');
  }

}
