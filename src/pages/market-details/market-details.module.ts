import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarketDetailsPage } from './market-details';

@NgModule({
  declarations: [
    MarketDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MarketDetailsPage),
  ],
})
export class MarketDetailsPageModule {}
