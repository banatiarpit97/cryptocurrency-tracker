import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { HoldingsProvider } from '../../providers/holdings/holdings';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  updatedTime;
  sum=0;
  constructor(public navCtrl: NavController, private holdingsProvider:HoldingsProvider, public storage : Storage) {
   
  }

  ionViewDidLoad(){
    this.storage.get('updatedTime').then(updatedTime => {
      this.updatedTime = updatedTime;
    })
    this.holdingsProvider.loadHoldings();
  }

  addHolding(){
    this.navCtrl.push('AddHoldingPage');
  }

  refreshPrices(refresher){
    this.holdingsProvider.fetchPrices(refresher);
    this.updatedTime = this.holdingsProvider.updatedTime;
    // this.calculateTotal();
  }
  editHolding(holding){
    console.log(this.holdingsProvider.holdings.indexOf(holding));
    this.navCtrl.push('AddHoldingPage', {holding:holding});
  }

  marketDetails(holding){
      this.navCtrl.push('MarketDetailsPage', {holding:holding});
  }
}
