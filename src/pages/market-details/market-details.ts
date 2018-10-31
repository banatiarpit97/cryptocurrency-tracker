import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MarketDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-market-details',
  templateUrl: 'market-details.html',
})
export class MarketDetailsPage {
  
  holding;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.holding = this.navParams.get('holding');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MarketDetailsPage');
  }

  showDetails(){
    
  }

}
