import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { timeoutWith } from 'rxjs/operators';
import * as moment from 'moment';
import * as $ from 'jquery'

interface Holding {
  crypto: string,
  currency: string,
  amount: number,
  value?: number,
  markets?
}

@Injectable()
export class HoldingsProvider {
  updatedTime; sum; storage_sum;
  public holdings:Holding[] = [];
  USDholdings = [];
  public pricesUnavailable: boolean = false;

  constructor(public http: HttpClient, private storage:Storage) {
    this.storage.get('total_assets').then(sum => {
      this.sum = sum;
      this.storage_sum = "start";
      console.log(this.sum);
    })
  }
  
  addHolding(holding:Holding){
    this.holdings.push(holding);
    this.fetchPrices();
    this.saveHoldings();
  }

  removeHolding(holding){
    this.holdings.splice(this.holdings.indexOf(holding), 1);
    this.fetchPrices();
    this.saveHoldings();
  }

  saveHoldings(){
    this.storage.set('cryptoHoldings', this.holdings);
  }

  loadHoldings(){
    this.storage.get('cryptoHoldings').then(holdings => {
      if(holdings !== null){
        this.holdings = holdings;
        this.fetchPrices();
      }
    });
    
  }

  editHolding(holding, index){
    this.holdings[index] = holding;
    this.fetchPrices();
    this.saveHoldings();
  }

  verifyHoldings(holding): Observable<any>{
    return this.http.get('https://api.cryptonator.com/api/ticker/' + holding.crypto + '-' + holding.currency).pipe(
      timeoutWith(5000, Observable.throw(new Error('Failed to verify holding.')))
    );  
  }

  fetchPrices(refresher?) {
    

    this.pricesUnavailable = false;
    let requests = [];
    for(let holding of this.holdings){
      let request = this.http.get('https://api.cryptonator.com/api/full/' + holding.crypto + '-' + holding.currency);
      requests.push(request);
    }

    forkJoin(requests).pipe(
      timeoutWith(5000, Observable.throw(new Error('Failed to fetch prices.')))
    ).subscribe(results => {
      this.updatedTime = moment(new Date()).format('MMM Do YYYY, h:mm:ss a');
      this.storage.set('updatedTime', this.updatedTime);
      results.forEach((result:any, index) => {
        console.log('2')
        this.holdings[index].value = result.ticker.price;
        this.holdings[index].markets = result.ticker.markets;
      });
      this.calculateTotal();
      
      if(typeof(refresher) !== 'undefined'){
        refresher.complete();
      }
      this.saveHoldings();
    }, err => {
      console.log('err')
      this.pricesUnavailable = true;
      if(typeof(refresher) !== 'undefined'){
        refresher.complete();
      }
    });
    // console.log(this.holdings);

  }
  calculateTotal() {
    this.USDholdings =[];
    var global = this;
    if (!this.pricesUnavailable){
      console.log('3')
    // this.sum = 0;
    for (let holding of this.holdings) {
      console.log(holding);
      console.log(holding.crypto);
      var url = "https://api.cryptonator.com/api/ticker/" + holding.crypto + "-USD";
      $.ajax({
        url: url,
        type:"GET",
        async:false,
        success:function(data){
          console.log('4')
          
          if(global.storage_sum == "start"){
            global.sum = 0;
            console.log('5')
            
            global.storage_sum = "not_start";
          }
          let UsdHolding = {
            name:null,
            Usdvalue:null,
            amount:null
          }
          UsdHolding.name = holding.crypto;
          UsdHolding.amount = holding.amount;
          UsdHolding.Usdvalue = data.ticker.price;
          global.USDholdings.push(UsdHolding);
          global.sum += (holding.amount * data.ticker.price);

        },
        error:function(){
          global.pricesUnavailable = true;
          console.log('error getting USD values');
        }
      })
      // if (holding.amount) {
      //   this.sum += (holding.amount * holding.value)
      // }
    }
    this.storage.set('total_assets', this.sum);
    console.log(this.sum)
      global.storage_sum = "start";
    
  }
    // console.log(this.USDholdings);
  }
}
